import { many, single, first, query } from '../db';

export type ForwardUrl = {
  id: number;
  createdAt: Date;
  endpointId: number;
  url: string;
};

const map = (entity): ForwardUrl | null =>
  entity == null
    ? null
    : {
        id: entity.id,
        createdAt: entity.created_at,
        endpointId: entity.endpoint_id,
        url: entity.url,
      };

export const findByUserEndpoint = async (
  userId: number,
  endpointId: number,
) =>
  (
    await many(
      `
        SELECT *
        FROM forward_urls
        WHERE user_id = $1 AND endpoint_id = $2
        ORDER BY created_at DESC
      `,
      [userId, endpointId],
    )
  ).map(e => map(e));

export const insert = async (
  endpointId: number,
  userId: number,
  url: string,
) => {
  const result = map(
    (await first(
      `
        SELECT *
        FROM forward_urls
        WHERE endpoint_id = $1 AND user_id = $2 AND url = $3
      `,
      [endpointId, userId, url],
    )) ??
      (await single(
        `
        INSERT INTO forward_urls
          (created_at, endpoint_id, user_id, url)
        VALUES
          (current_timestamp, $1, $2, $3)
        RETURNING *
      `,
        [endpointId, userId, url],
      )),
  );

  await prune(endpointId, userId, 5);
  return result;
};

const prune = async (
  endpointId: number,
  userId: number,
  limit: number,
) => {
  await query(
    `
      DELETE FROM forward_urls
      WHERE id IN (
        SELECT id
        FROM forward_urls
        WHERE endpoint_id = $1 AND user_id = $2
        ORDER BY created_at DESC
        OFFSET $3
      )
    `,
    [endpointId, userId, limit],
  );
};
