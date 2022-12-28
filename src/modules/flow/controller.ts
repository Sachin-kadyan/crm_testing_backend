import { NextFunction, Request, Response } from "express";
import { ClientSession } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { iWebhookPayload } from "../../types/flow/webhook";
import ErrorHandler from "../../utils/errorHandler";
import { findOneService } from "../service/crud";
import {
  connectFlow,
  createListNode,
  createReplyNode,
  findAndSendNode,
  findFlowConnectorByTemplateIdentifier,
} from "./functions";

export const createReplyNodeController = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const data = await createReplyNode(req.body, session);
    res.status(200).json(data);
  }
);

export const createListNodeController = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const data = await createListNode(req.body, session);
    res.status(200).json(data);
  }
);

// flow connector

export const ConnectFlow = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const service = await findOneService({ _id: req.body.serviceId });
    if (service === null) throw new ErrorHandler("Invalid Service Id", 400);
    const connector = await connectFlow(req.body, session);
    res.status(200).json(connector);
  }
);

// webhook
export const HandleWebhook = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const body: iWebhookPayload = req.body;
    body.entry.forEach((entry) => {
      entry.changes.forEach((changes) => {
        changes.value.messages.forEach(async (message, mi) => {
          if (message.button) {
            const connector = await findFlowConnectorByTemplateIdentifier(message.button.text);
            if (connector) {
              await findAndSendNode(connector.nodeIdentifier, changes.value.contacts[mi].wa_id);
            }
          } else if (message.interactive) {
            const nodeIdentifier = message.interactive.button_reply?.id || message.interactive.list_reply?.id;
            if (nodeIdentifier) {
              await findAndSendNode(nodeIdentifier, changes.value.contacts[mi].wa_id);
            }
          }
        });
      });
    });
    res.sendStatus(200);
  }
);
