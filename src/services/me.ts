import config from 'config';
import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import { verifyToken } from './authentication';
import { findById, updateActivity } from '../models/user';

const authorizeAndFetch = async (token: string) => {
  try {
    const { id } = (await verifyToken(
      token,
      config.jwt.secret,
    )) as any;

    const user = await findById(id);
    if (!user) throw new Error('User was deleted.');

    return user;
  } catch (e) {
    throw new AuthenticationError('Session expired.');
  }
};

export const getMe = async (req: Request, ipAddress: string) => {
  const token = req.headers['x-token'] as string;
  if (!token) return undefined;

  const user = await authorizeAndFetch(token);
  return await updateActivity(user.id, ipAddress, false, true);
};

export const getSubscriber = async (connectionParams: Object) => {
  const token = connectionParams['x-token'];
  if (!token) throw new AuthenticationError('Missing x-token.');

  return await authorizeAndFetch(token);
};
