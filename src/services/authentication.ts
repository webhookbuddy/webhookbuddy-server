import * as jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

export const createToken = async (data, secret, expiresIn) =>
  await jwt.sign(data, secret, {
    expiresIn,
  });

export const verifyToken = async (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AuthenticationError('Session expired.');
  }
};
