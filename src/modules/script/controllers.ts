import { NextFunction, Request, Response } from "express";
import { ClientSession, ObjectId } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import ErrorHandler from "../../utils/errorHandler";
import { getServiceById } from "../service/functions";
import { findStageById } from "../stages/functions";
import { createScript, getScript, getScripts, getScriptsCount } from "./functions";

export const CreateScript = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const service = await getServiceById(req.body.service); // check if service exist
    if (service === null) throw new ErrorHandler("Service Not Found", 404);
    const stage = await findStageById(req.body.stage); // check if stage exist
    if (stage === null) throw new ErrorHandler("Stage Not Found", 404);
    const script = await createScript(req.body, session); // create script
    res.status(200).json(script);
  }
);

export const GetScript = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const { scriptId, serviceId } = req.params as unknown as { scriptId: ObjectId; serviceId: ObjectId }; // converted to objectIds in validations
    const script = await getScript(scriptId, serviceId); // find script
    res.status(200).json(script);
  }
);

export const GetScripts = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const { pageLength, page } = req.query as unknown as { pageLength: number; page: number };
    const scripts = await getScripts(page, pageLength);
    const total = await getScriptsCount();
    return res.status(200).json({ scripts, total });
  }
);
