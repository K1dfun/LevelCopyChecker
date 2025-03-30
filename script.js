async function fetchAllLevels() {
  let allLevels = [];
  let url = "https://api.slin.dev/grab/v1/list?max_format_version=11&type=newest";
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();

      // Only push if levels is an actual array
      if (data && Array.isArray(data.levels)) {
        allLevels.push(...data.levels);
      } else {
        console.warn("No levels array found in response:", data);
      }

      if (data && data.next_page_timestamp) {
        url = `https://api.slin.dev/grab/v1/list?max_format_version=11&type=newest&page_timestamp=${data.next_page_timestamp}`;
      } else {
        hasNextPage = false;
      }

    } catch (err) {
      console.error("Fetch error:", err);
      hasNextPage = false;
    }
  }

  return allLevels;
}
