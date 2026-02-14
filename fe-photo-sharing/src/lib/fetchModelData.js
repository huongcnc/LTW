export const baseURL = "http://localhost:8081";

export default async function fetchModel(url) {
  try {
    const fullUrl = baseURL + url;
    const response = await fetch(fullUrl);
    const result = await response.json();
    return result;
  }
  catch (error) {
    console.error(error);
  }
}
export const getInitials = (first, last) => {
  return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
};
export function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString();
}
