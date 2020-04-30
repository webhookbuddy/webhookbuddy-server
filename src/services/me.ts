import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import { verifyToken } from './authentication';
import { findById, updateActivity } from '../models/user';

export const getMe = async (req: Request, ipAddress: string) => {
  const token = req.headers['x-token'];
  if (!token) return undefined;

  try {
    const { id } = (await verifyToken(
      token,
      process.env.JWT_SECRET,
    )) as any;

    const user = await findById(id);
    if (!user) throw new Error('User was deleted.');

    const activeUser = await updateActivity(
      id,
      ipAddress,
      false,
      true,
    );

    return activeUser;
  } catch (e) {
    throw new AuthenticationError('Session expired.');
  }
};
