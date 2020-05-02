import { KeyValue, Page } from './types';
import { single, any, many } from '../db';

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

const include =
  'id, created_at, endpoint_id, ip_address, method, headers, query, content_type, body';

export const findById = async (id: number) =>
  map(
    await single(`SELECT ${include} FROM webhooks WHERE id = $1`, [
      id,
    ]),
  );

export const findPage = async (
  endpointId: number,
  after?: number,
  limit: number = 100,
): Promise<Page<Webhook>> => {
  const parameters = [endpointId, limit + 1];
  const rows = await many(
    `
      SELECT ${include}
      FROM webhooks
      WHERE endpoint_id = $1
        ${after ? 'AND id < $3' : ''}
      ORDER BY id DESC
      LIMIT $2
    `,
    after ? parameters.concat(after) : parameters,
  );

  const hasNextPage = rows.length > limit;
  const nodes = hasNextPage ? rows.slice(0, -1) : rows;
  return {
    nodes: nodes.map(n => map(n)),
    pageInfo: {
      hasNextPage,
      endCursor: nodes.length ? nodes[nodes.length - 1].id : null,
    },
  };
};

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
