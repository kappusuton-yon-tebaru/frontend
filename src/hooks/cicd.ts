export default function formatDate(isoString: string) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthShort = date.toLocaleString("en-US", { month: "short" }); // Months are 0-based
  const year = date.getFullYear();
  return `${day} ${monthShort} ${year}`;
}
