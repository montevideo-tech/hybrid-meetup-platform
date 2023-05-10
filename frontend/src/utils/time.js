export const epochToISO8601 = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date
    .toISOString()
    .replace("T", " ")
    .replace("Z", "+00");
  return formattedDate;
};
