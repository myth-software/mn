import { NextFunction, Request, Response } from 'express';

export default async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
