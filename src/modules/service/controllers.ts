import { NextFunction, Request, Response } from "express";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { createServiceHandler, getAllServices, searchService } from "./functions";

export const createService = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await createServiceHandler(req.body);
  return res.status(status).json(body);
});

export const GetServices = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const services = await getAllServices();
  res.status(200).json(services);
});

export const search = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { search, tag } = <{ search: string; tag: string }>req.query;
  const { status, body } = await searchService(search, tag);
  return res.status(status).json(body);
});
