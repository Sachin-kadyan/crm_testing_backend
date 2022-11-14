import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import ErrorHandler from "../../utils/errorHandler";

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessSecret } = process.env;
    const auth = req.headers["authorization"] as string;
    if (!auth) return next(new ErrorHandler("Unauthorized", 401, [{ error: "Login to continue" }]));
    const token = auth?.split(" ")[1];
    const user = <Record<string, any>>JWT.verify(token, accessSecret!);
    req.user = user;
    next();
  } catch (error) {
    next(new ErrorHandler("JWT Malformed", 403, [{ error: "JWT Malformed" }]));
  }
};

export default isLoggedIn;
