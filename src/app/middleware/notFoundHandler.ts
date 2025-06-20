import { Request, Response, NextFunction } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  (error as any).status = 404;
  (error as any).name = "NotFoundError";
  next(error);
};
export default notFoundHandler;
