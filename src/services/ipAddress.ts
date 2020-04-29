import { Request } from 'express';

const ipAddress = (req: Request) =>
  (
    (process.env.NODE_ENV === 'development'
      ? <string>req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress
      : req.connection.remoteAddress) || ''
  )
    .split(',')[0]
    .trim();

export default ipAddress;
