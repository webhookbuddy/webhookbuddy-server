import { throwExpression } from '../utils/throwExpression';
import { findByReferenceId } from '../models/endpoint';
import { insert } from '../models/webhook';
import pubSub, { EVENTS } from '../subscriptions';

const mapHeaders = (rawHeaders: string[]) => {
  const headers: any = {};
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
  contentType: string | null;
  rawHeaders: string[];
  query: object;
  body: string | null;
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
    id: webhook?.id ?? throwExpression('webhook is null'),
  };
};

export default processWebhook;
