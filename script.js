function getTimestampFromURL(url) {
  const match = url.match(/:(\d+)$/);
  return match ? match[1] : null;
}

async function fetchAllLevels() {
  let allLevels = [];
  let url = "https://api.slin.dev/grab/v1/list?max_format_version=11&type=newest";
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await fetch(url);
    const data = await res.json();
    allLevels.push(...data.levels);

    if (data.next_page_timestamp) {
      url = `https://api.slin.dev/grab/v1/list?max_format_version=11&type=newest&page_timestamp=${data.next_page_timestamp}`;
    } else {
      hasNextPage = false;
    }
  }

  return allLevels;
}

function findMatchingLevels(levels, targetTimestamp) {
  return levels.filter(level => {
    const parts = level.identifier.split(":");
    return parts[1] === targetTimestamp;
  });
}

async function checkDuplicates() {
  const input = document.getElementById("levelUrl").value;
  const timestamp = getTimestampFromURL(input);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Checking...";

  if (!timestamp) {
    resultsDiv.innerHTML = "Invalid level URL.";
    return;
  }

  const allLevels = await fetchAllLevels();
  const matches = findMatchingLevels(allLevels, timestamp);

  if (matches.length === 0) {
    resultsDiv.innerHTML = "No matching levels found.";
  } else {
    resultsDiv.innerHTML = `<strong>Found ${matches.length} matching level(s):</strong><br>`;
    matches.forEach(match => {
      const a = document.createElement("a");
      a.href = `https://grabvr.quest/levels/viewer/?level=${match.identifier}`;
      a.textContent = match.identifier;
      a.target = "_blank";
      const div = document.createElement("div");
      div.className = "result-item";
      div.appendChild(a);
      resultsDiv.appendChild(div);
    });
  }
}
