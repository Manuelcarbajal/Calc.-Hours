export const formateMDY = (date) => {
  const d = new Date(date);
  function getMonthName(date) {
    return date.toLocaleString("en-US", { month: "short" });
  }
  return date ? `${getMonthName(d)}/${d.getDate()}/${d.getFullYear()}` : "";
};
