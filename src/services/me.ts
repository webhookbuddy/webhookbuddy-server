import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import { verifyToken } from './authentication';
import { query, single } from '../db';
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
    const user = await single(
      `
        SELECT id, created_at, updated_at, first_name, last_name, email
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    if (!user) throw new Error('User was deleted.');

    await query(
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
      id: user.id,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    };
  } catch (e) {
    throw new AuthenticationError('Session expired.');
  }
};
