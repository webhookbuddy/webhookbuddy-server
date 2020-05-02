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

  const webhook = await insert(
    endpoint.id,
    ipAddress,
    method,
    headers,
    query,
    contentType,
    body,
  );

  return {
    id: webhook.id,
  };
};

export default processWebhook;
