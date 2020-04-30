import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import { verifyToken } from './authentication';

export const getMe = async (req: Request) => {
  const token = req.headers['x-token'];
  if (!token) return undefined;
  try {
    return await verifyToken(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new AuthenticationError('Session expired.');
  }
};
