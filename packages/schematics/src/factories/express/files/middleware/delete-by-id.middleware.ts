import { NextFunction, Request, Response } from 'express';

export default async function deleteById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
