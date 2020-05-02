export const extractContentType = (header: string) => {
  const parts = header.split(';').map(s => s.trim().toLowerCase());
  return parts.length > 0 ? parts[0] : null;
};
