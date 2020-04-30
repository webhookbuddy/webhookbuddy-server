import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import { verifyToken } from './authentication';
import db from '../db';
import { User } from '../types';

export const getMe = async (
  req: Request,
  ipAddress: string,
): Promise<User> => {
  const token = req.headers['x-token'];
  if (!token) return undefined;

  try {
    const { id } = (await verifyToken(
      token,
      process.env.JWT_SECRET,
    )) as any;
    const { rows } = await db.query(
      `
        SELECT id, created_at, updated_at, first_name, last_name, email
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    if (!rows.length) throw new Error();

    await db.query(
      `
        UPDATE users
        SET
          last_activity_at = current_timestamp,
          activity_count = activity_count + 1,
          last_ip_address = $1
        WHERE id = $2;
      `,
      [ipAddress, id],
    );

    return {
      id: rows[0].id,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at,
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      email: rows[0].email,
    };
  } catch (e) {
    throw new AuthenticationError('Session expired.');
  }
};
