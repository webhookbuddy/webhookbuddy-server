import db from '../db';

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
  const {
    rows: endpoints,
  } = await db.query(
    'SELECT id FROM endpoints WHERE reference_id = $1',
    [referenceId],
  );

  if (endpoints.length === 0) throw new Error(`Endpoint not found.`);

  const parts = contentType
    .split(';')
    .map(s => s.trim().toLowerCase());
  const mediaType = parts.length > 0 ? parts[0] : null;

  const { rows: webhooks } = await db.query(
    `
    INSERT INTO webhooks
      (created_at, updated_at, endpoint_id, ip_address, method, content_type, headers, query, body, body_json)
    VALUES
      (current_timestamp, current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `,
    [
      endpoints[0].id,
      ipAddress,
      method,
      mediaType,
      headers,
      query,
      body,
      mediaType === 'application/json' && isJSON(body) ? body : null, // Don't JSON.parse() before inserting, as that'll throw an exception for JSON arrays: https://github.com/brianc/node-postgres/issues/442
    ],
  );

  if (webhooks.length === 0)
    throw new Error('Error processing webhook.');

  return webhooks[0];
};

export default processWebhook;
