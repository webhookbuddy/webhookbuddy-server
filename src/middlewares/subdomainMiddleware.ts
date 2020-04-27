import { Request, Response, NextFunction } from 'express';

const subdomainMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.subdomains.length === 1 && req.subdomains[0] === 'point')
    req.url = `/point${req.url}`;

  next();
};

export default subdomainMiddleware;
