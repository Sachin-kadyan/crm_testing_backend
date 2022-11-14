import { NextFunction, Request, Response } from "express";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { registerConsumerHandler, searchConsumer } from "./functions";

export const register = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await registerConsumerHandler(req.body);
  return res.status(status).json(body);
});

export const search = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await searchConsumer(req.query.search as string);
  return res.status(status).json(body);
});
