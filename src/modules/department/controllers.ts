import { NextFunction, Request, Response } from "express";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { createDepartmentHandler } from "./functions";

export const addDepartment = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await createDepartmentHandler(req.body);
  res.status(status).json(body);
});
