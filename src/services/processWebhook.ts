import { findByReferenceId } from '../models/endpoint';
import { insert } from '../models/webhook';
import pubSub, { EVENTS } from '../subscriptions';

const mapHeaders = (rawHeaders: string[]) => {
  const headers = {};
  for (let i = 0; i < rawHeaders.length; i = i + 2)
    headers[rawHeaders[i]] = rawHeaders[i + 1];

  return headers;
};

const processWebhook = async ({
  referenceId,
  ipAddress,
  method,
  contentType,
  rawHeaders,
  query,
  body,
}: {
  referenceId: string;
  ipAddress: string;
  method: string;
  contentType: string;
  rawHeaders: string[];
  query: object;
  body: string;
}) => {
  const endpoint = await findByReferenceId(referenceId);
  if (!endpoint) throw new Error(`Endpoint not found.`);

  const webhook = await insert(
    endpoint.id,
    ipAddress,
    method,
    mapHeaders(rawHeaders),
    query,
    contentType,
    body,
  );

  pubSub.publish(EVENTS.WEBHOOK.CREATED, {
    webhookCreated: {
      webhook,
      endpoint,
    },
  });

  return {
    id: webhook.id,
  };
};

export default processWebhook;
