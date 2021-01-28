import crypto from 'crypto';
import { throwExpression } from 'utils/throwExpression';

const iterations = 10000;

const saltedHash = (password: string, salt: string) =>
  crypto
    .pbkdf2Sync(password, salt, iterations, 512, 'sha512')
    .toString('hex');

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return {
    hash: saltedHash(password, salt),
    salt,
  };
};

export const verifyPassword = (
  password: string,
  hash: string,
  salt: string,
) => hash === saltedHash(password, salt);
