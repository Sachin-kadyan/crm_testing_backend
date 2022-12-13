import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import { ClientSession } from "mongodb";
import ErrorHandler from "../utils/errorHandler";
import MongoService from "../utils/mongo";
const PromiseWrapper =
  (func: (req: Request, res: Response, next: NextFunction, session: ClientSession) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const session = MongoService.session;
    try {
      validationResult(req).throw();
      await session.withTransaction(async () => func(req, res, next, session));
    } catch (error: any) {
      if (error.messages) {
        next(error);
      } else if (error[0]) {
        next(
          new ErrorHandler(
            "VALIDATION_ERROR",
            403,
            error.array({ onlyFirstError: true }).map((error: ValidationError) => {
              return { error: error.msg + " " + error.value + " at " + error.param };
            })
          )
        );
      } else {
        next(new ErrorHandler("SOMETHING WENT WRONG", 500, [{ error: error.message }]));
      }
    }
  };

export default PromiseWrapper;
