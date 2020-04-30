import { many } from '../db';

export type ForwardUrl = {
  id: number;
  createdAt: Date;
  url: string;
};

const map = (entity): ForwardUrl | null =>
  entity === null
    ? null
    : {
        id: entity.id,
        createdAt: entity.created_at,
        url: entity.url,
      };

export const findByKeys = async (
  keys: { userId: number; endpointId: number }[],
) => {
  const urls = await many(
    `
      SELECT id, created_at, url, user_id, endpoint_id
      FROM forward_urls
      WHERE 
      ${keys.reduce((acc, cur) => {
        if (
          !Number.isInteger(cur.userId) ||
          !Number.isInteger(cur.endpointId)
        )
          throw new Error('Invalid operation.'); // Guard against SQL injection

        return `${acc} OR (user_id = ${cur.userId} AND endpoint_id = ${cur.endpointId})`;
      }, '1 = 0')}
    `,
  );

  return keys.map(key =>
    urls
      .filter(
        url =>
          url.user_id === key.userId &&
          url.endpoint_id === key.endpointId,
      )
      .map(e => map(e)),
  );
};
