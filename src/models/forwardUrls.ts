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

export const findByUserEndpoint = async (
  userId: number,
  endpointId: number,
) =>
  (
    await many(
      `
        SELECT id, url
        FROM forward_urls
        WHERE 
        user_id = $1
        AND 
        endpoint_id = $2
      `,
      [userId, endpointId],
    )
  ).map(e => map(e));
