import { Request } from 'express';

const ipAddress = (req: Request) =>
  (<string>req.headers['x-forwarded-for'] || req.ip || '')
    .split(',')
    .pop()!
    .trim();

export default ipAddress;
