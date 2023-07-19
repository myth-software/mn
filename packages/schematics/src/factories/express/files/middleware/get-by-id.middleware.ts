import { NextFunction, Request, Response } from 'express';

export default async function getById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
