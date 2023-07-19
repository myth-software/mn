import { NextFunction, Request, Response } from 'express';

export default async function router(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
