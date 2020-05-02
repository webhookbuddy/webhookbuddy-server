import { KeyValue } from './types';
import { many } from '../db';

export type Forward = {
  id: number;
  createdAt: Date;
  url: string;
  method: string;
  statusCode: number;
  headers: KeyValue[];
  query: KeyValue[];
  contentType?: string;
  body?: string;
};

const map = (entity): Forward | null =>
  entity === null
    ? null
    : {
        id: entity.id,
        createdAt: entity.created_at,
        url: entity.url,
        method: entity.method,
        statusCode: entity.status_code,
        headers: Object.entries(entity.headers).map(
          o => ({ key: o[0], value: o[1] } as KeyValue),
        ),
        query: Object.entries(entity.query).map(
          o => ({ key: o[0], value: o[1] } as KeyValue),
        ),
        contentType: entity.content_type,
        body: entity.body,
      };

export const findByKeys = async (
  keys: { userId: number; webhookId: number }[],
) => {
  const forwards = await many(
    `
      SELECT *
      FROM forwards
      WHERE
      ${keys.reduce((acc, cur) => {
        if (
          !Number.isInteger(cur.userId) ||
          !Number.isInteger(cur.webhookId)
        )
          throw new Error('Invalid operation.'); // Guard against SQL injection

        return `${acc} OR (user_id = ${cur.userId} AND webhook_id = ${cur.webhookId})`;
      }, '1 = 0')}
    `,
  );

  return keys.map(key =>
    forwards
      .filter(
        forward =>
          forward.user_id === key.userId &&
          forward.webhook_id === key.webhookId,
      )
      .map(e => map(e)),
  );
};
