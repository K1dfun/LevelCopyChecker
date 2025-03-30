async function fetchAllLevels() {
  let allLevels = [];
  let url = "https://api.slin.dev/grab/v1/list?max_format_version=11&type=newest";
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Fetch failed:", res.status, res.statusText);
        break;
      }

      const data = await res.json();
      const levels = Array.isArray(data.levels) ? data.levels : [];

      allLevels.push(...levels);

      if (data.next_page_timestamp) {
        url = `https://api.slin.dev/grab/v1/list?max_format_version=11&type=newest&page_timestamp=${data.next_page_timestamp}`;
      } else {
        hasNextPage = false;
      }

    } catch (err) {
      console.error("Error while fetching levels:", err);
      hasNextPage = false;
    }
  }

  return allLevels;
}
