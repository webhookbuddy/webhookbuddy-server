import { Request } from 'express';

const ipAddress = (req: Request) =>
  (
    <string>req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    ''
  )
    .split(',')
    .pop()
    .trim();

export default ipAddress;
