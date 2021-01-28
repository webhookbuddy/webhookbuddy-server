import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export const createToken = async (
  data: Object,
  secret: string,
  expiresIn: string,
) =>
  await jwt.sign(data, secret, {
    expiresIn,
  });

export const verifyToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AuthenticationError('Session expired.');
  }
};
