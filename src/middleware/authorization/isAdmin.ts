import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../../utils/errorHandler";

export const ROLES = [
  {
    name: "ADMIN",
    order: 10,
  },
  {
    name: "REPRESENTATIVE",
    order: 6,
  },
];

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return next(new ErrorHandler("PERMISSION DENIED", 401));
  }
  next();
};

export const isRepresentative = async (req: Request, res: Response, next: NextFunction) => {
  const user = ROLES.find((role) => role.name === req.user!.role);
  if (user && user.order < 6) {
    return next(new ErrorHandler("PERMISSION DENIED", 401));
  }
  next();
};

export default isAdmin;
