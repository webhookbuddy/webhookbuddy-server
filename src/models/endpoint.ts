import { single, any, many } from '../db';

export type Endpoint = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  referenceId: string;
  name: string;
};

const map = (entity): Endpoint | null =>
  entity === null
    ? null
    : {
        id: entity.id,
        createdAt: entity.created_at,
        updatedAt: entity.updated_at,
        referenceId: entity.reference_id,
        name: entity.name,
      };

export const findById = async (id: number) =>
  map(await single(`SELECT * FROM endpoints WHERE id = $1`, [id]));

export const findByReferenceId = async (referenceId: string) =>
  map(
    await single(`SELECT * FROM endpoints WHERE reference_id = $1`, [
      referenceId,
    ]),
  );

export const findByUserId = async (userId: number) =>
  (
    await many(
      `
      SELECT e.*
      FROM endpoints as e
      INNER JOIN user_endpoints as ue on ue.endpoint_id = e.id
      WHERE ue.user_id = $1
    `,
      [userId],
    )
  ).map(e => map(e));

export const isUserEndpoint = async (
  userId: number,
  endpointId: number,
) =>
  await any(
    `
    SELECT e.id
    FROM endpoints as e
      INNER JOIN user_endpoints as ue on ue.endpoint_id = e.id
    WHERE 
      e.id = $1
      AND
      ue.user_id = $2
  `,
    [endpointId, userId],
  );
