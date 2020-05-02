import { single, transactionSingle, any, many, query } from '../db';

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

export const isEndpointUser = async (
  endpointId: number,
  userId: number,
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

export const insert = async (
  referenceId: string,
  name: string,
  userId: number,
) => {
  const entity = await transactionSingle(
    `
      with new_endpoint as (
        INSERT INTO endpoints(created_at, reference_id, name)
        VALUES (current_timestamp, $1, $2)
        RETURNING *
      )
      
      INSERT INTO user_endpoints(user_id, endpoint_id, created_at)
      SELECT $3, id, current_timestamp from new_endpoint
      RETURNING *
    `,
    [referenceId, name, userId],
  );
  // TODO: get the query above to return the new endpoint so that it doesn't require another network round trip
  return map(
    await single('SELECT * FROM endpoints WHERE id = $1', [
      entity.endpoint_id,
    ]),
  );
};

export const deleteEndpoint = async (id: number) => {
  const { rowCount } = await query(
    `
      DELETE FROM endpoints
      WHERE id = $1
    `,
    [id],
  );
  return rowCount;
};
