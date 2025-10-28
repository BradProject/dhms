// utils/reportUtils.js
export const filterHubsByPeriod = (list, period = "all") => {
  if (period === "all") return list;

  const now = new Date();
  if (period === "year") {
    return list.filter((h) => {
      return new Date(h.createdAt).getFullYear() === now.getFullYear();
    });
  }

  if (period === "quarterly") {
    const quarter = Math.floor((now.getMonth() + 1) / 3) + 1;
    return list.filter((h) => {
      const d = new Date(h.createdAt);
      const q = Math.floor((d.getMonth() + 1) / 3) + 1;
      return d.getFullYear() === now.getFullYear() && q === quarter;
    });
  }

  return list;
};
