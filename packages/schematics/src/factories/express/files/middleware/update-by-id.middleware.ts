import { NextFunction, Request, Response } from 'express';

export default async function updateById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
