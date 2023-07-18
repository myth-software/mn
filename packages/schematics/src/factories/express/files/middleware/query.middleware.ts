import { NextFunction, Request, Response } from 'express';

export default async function query(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
