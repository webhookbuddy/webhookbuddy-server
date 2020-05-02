import { KeyValue } from './types';
import { single, any } from '../db';

export type Webhook = {
  id: number;
  createdAt: Date;
  ipAddress: string;
  method: StorageManager;
  headers: KeyValue[];
  query: KeyValue[];
  contentType?: string;
  body?: string;
};

const isJSON = (json: string) => {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
};

const map = (entity): Webhook | null =>
  entity === null
    ? null
    : {
        id: entity.id,
        createdAt: entity.created_at,
        ipAddress: entity.ip_address,
        method: entity.method,
        headers: Object.entries(entity.headers).map(
          o => ({ key: o[0], value: o[1] } as KeyValue),
        ),
        query: Object.entries(entity.query).map(
          o => ({ key: o[0], value: o[1] } as KeyValue),
        ),
        contentType: entity.content_type,
        body: entity.body,
      };

export const findById = async (id: number) =>
  map(await single(`SELECT * FROM webhooks WHERE id = $1`, [id]));

export const isWebhookUser = async (
  webhookId: number,
  userId: number,
) =>
  await any(
    `
      SELECT w.id
      FROM webhooks as w
        INNER JOIN endpoints as e on e.id = w.endpoint_id
        INNER JOIN user_endpoints as ue on ue.endpoint_id = e.id
      WHERE
        w.id = $1
        AND
        ue.user_id = $2
    `,
    [webhookId, userId],
  );

export const insert = async (
  endpointId: number,
  ipAddress: string,
  method: string,
  headers: object,
  query: object,
  contentType?: string,
  body?: string,
) =>
  map(
    await single(
      `
        INSERT INTO webhooks
          (created_at, endpoint_id, ip_address, method, headers, query, content_type,  body, body_json)
        VALUES
          (current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        endpointId,
        ipAddress,
        method,
        headers,
        query,
        contentType,
        body,
        contentType === 'application/json' && isJSON(body)
          ? body
          : null, // Don't JSON.parse() before inserting, as that'll throw an exception for JSON arrays: https://github.com/brianc/node-postgres/issues/442
      ],
    ),
  );
