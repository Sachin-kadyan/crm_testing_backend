import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../../utils/errorHandler";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return next(new ErrorHandler("PERMISSION DENIED", 401, [{ error: "Access permission denied. Contact Admin!" }]));
  }
  next();
};

export default isAdmin;
