import { single } from '../db';

const isJSON = (json: string) => {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
};

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
  const endpoint = await single(
    'SELECT id FROM endpoints WHERE reference_id = $1',
    [referenceId],
  );

  if (!endpoint) throw new Error(`Endpoint not found.`);

  const parts = contentType
    .split(';')
    .map(s => s.trim().toLowerCase());
  const mediaType = parts.length > 0 ? parts[0] : null;

  const webhook = await single(
    `
      INSERT INTO webhooks
        (created_at, endpoint_id, ip_address, method, content_type, headers, query, body, body_json)
      VALUES
        (current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [
      endpoint.id,
      ipAddress,
      method,
      mediaType,
      headers,
      query,
      body,
      mediaType === 'application/json' && isJSON(body) ? body : null, // Don't JSON.parse() before inserting, as that'll throw an exception for JSON arrays: https://github.com/brianc/node-postgres/issues/442
    ],
  );

  return {
    id: webhook.id,
  };
};

export default processWebhook;
