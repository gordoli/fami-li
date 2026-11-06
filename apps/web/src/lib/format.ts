const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
});
const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function formatMonth(isoDate: string) {
  return monthFormatter.format(new Date(isoDate));
}
export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}
export function tripDuration(start: string, end: string) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1;
}
