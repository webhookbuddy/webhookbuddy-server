export const parseContentType = (header: string) => {
  const parts = header.split(';').map(s => s.trim().toLowerCase());
  return parts.length > 0 ? parts[0] : null;
};

export const extractContentType = (headers: any) => {
  const key = Object.keys(headers).find(
    key => key.toLocaleLowerCase() === 'content-type',
  );

  if (!key) return null;

  return parseContentType(headers[key] as string);
};
