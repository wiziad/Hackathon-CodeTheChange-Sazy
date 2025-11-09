export function getSession() {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem("metra_session");
  return s ? JSON.parse(s) : null;
}