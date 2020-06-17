import { many, single } from '../db';

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
) =>
  map(
    await single(
      `
        INSERT INTO forward_urls
          (created_at, endpoint_id, user_id, url)
        VALUES
          (current_timestamp, $1, $2, $3)
        RETURNING *
      `,
      [endpointId, userId, url],
    ),
  );
