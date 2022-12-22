import { NextFunction, Request, Response } from "express";
import { ClientSession } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { createReplyNode } from "./functions";

export const createReplyNodeController = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const data = await createReplyNode(req.body, session);
    res.status(200).json(data);
  }
);
