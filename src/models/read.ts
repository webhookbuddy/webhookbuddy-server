import { many } from '../db';

export interface Read {
  webhookId: number;
  userId: number;
  createdAt: Date;
}

const include = 'webhook_id, user_id, created_at';

const map = (entity: any): Read | null =>
  entity == null
    ? null
    : {
        webhookId: entity.webhook_id,
        userId: entity.user_id,
        createdAt: entity.created_at,
      };

export const findByKeys = async (keys: { webhookId: number }[]) => {
  const reads = await many(
    `
      SELECT ${include}
      FROM reads
      WHERE
      ${keys.reduce((acc, cur) => {
        if (!Number.isInteger(cur.webhookId))
          throw new Error('Invalid operation.'); // Guard against SQL injection

        return `${acc} OR webhook_id = ${cur.webhookId}`;
      }, '1 = 0')}
    `,
  );

  return keys.map(key =>
    reads
      .filter(read => read.webhook_id === key.webhookId)
      .map(e => map(e)),
  );
};
