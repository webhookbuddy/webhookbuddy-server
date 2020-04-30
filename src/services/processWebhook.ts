import { findByReferenceId } from '../models/endpoint';
import { insert } from '../models/webhook';

const processWebhook = async ({
  referenceId,
  ipAddress,
  method,
  contentType,
  headers,
  query,
  body,
}: {
  referenceId: string;
  ipAddress: string;
  method: string;
  contentType: string;
  headers: object;
  query: object;
  body: string;
}) => {
  const endpoint = await findByReferenceId(referenceId);
  if (!endpoint) throw new Error(`Endpoint not found.`);

  const parts = contentType
    .split(';')
    .map(s => s.trim().toLowerCase());
  const mediaType = parts.length > 0 ? parts[0] : null;

  const webhook = await insert(
    endpoint.id,
    ipAddress,
    method,
    headers,
    query,
    mediaType,
    body,
  );

  return {
    id: webhook.id,
  };
};

export default processWebhook;
