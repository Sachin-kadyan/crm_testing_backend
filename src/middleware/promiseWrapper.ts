import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import ErrorHandler from "../utils/errorHandler";
const PromiseWrapper =
  (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validationResult(req).throw();
      return Promise.resolve(func(req, res, next)).catch((error: any) => {
        if (error.messages) next(error);
        next(new ErrorHandler("SOMETHING WENT WRONG", 500, [{ error: error.message }]));
      });
    } catch (errors: any) {
      next(
        new ErrorHandler(
          "VALIDATION_ERROR",
          403,
          errors.array({ onlyFirstError: true }).map((error: ValidationError) => {
            return { error: error.msg + " " + error.value + " at " + error.param };
          })
        )
      );
    }
  };

export default PromiseWrapper;
