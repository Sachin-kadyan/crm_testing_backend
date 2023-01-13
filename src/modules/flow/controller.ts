import { NextFunction, Request, Response } from "express";
import { ClientSession } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import {
  findConsumerFromWAID,
  saveMessageFromWebhook,
  saveTextMessage,
} from "../../services/whatsapp/webhook";
import { iWebhookPayload } from "../../types/flow/webhook";
import ErrorHandler from "../../utils/errorHandler";
import { findConsumerById } from "../consumer/functions";
import { findOneService } from "../service/crud";
import {
  connectFlow,
  createListNode,
  createReplyNode,
  findAndSendNode,
  findFlowConnectorByTemplateIdentifier,
  sendTextMessage,
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
export const HandleWebhook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: iWebhookPayload = req.body;
    //handling the responses
    body.entry.forEach((entry) => {
      entry.changes.forEach((changes) => {
        changes.value.messages.forEach(async (message, mi) => {
          const { consumer, ticket } = await findConsumerFromWAID(changes.value.contacts[mi].wa_id);
          if (!consumer && !ticket) throw new ErrorHandler("Consumer Not Found", 404);
          if (message.button) {
            const connector = await findFlowConnectorByTemplateIdentifier(message.button.text);
            if (connector) {
              await findAndSendNode(connector.nodeIdentifier, changes.value.contacts[mi].wa_id, ticket);
              await saveMessageFromWebhook(body, consumer, ticket); // saving message
            }
          } else if (message.interactive) {
            const nodeIdentifier =
              message.interactive.type === "button_reply"
                ? message.interactive.button_reply.id
                : message.interactive.list_reply.id;
            console.log(message.interactive);
            await findAndSendNode(nodeIdentifier, changes.value.contacts[mi].wa_id, ticket);
            await saveMessageFromWebhook(body, consumer, ticket); // saving message
          }
        });
      });
    });
    return res.sendStatus(200);
  } catch (error: any) {
    console.log(error.response.data);
    return res.sendStatus(200);
  }
};

export const SendMessage = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const { message, consumerId } = req.body;
    const consumer = await findConsumerById(consumerId);
    if (consumer === null) throw new ErrorHandler("Consumer Not Found", 400);
    const sender = req.user!.firstName + " " + req.user!.lastName;
    await sendTextMessage(message, consumer.phone, sender);
    const { ticket } = await findConsumerFromWAID(consumer.phone);
    saveTextMessage(
      {
        consumer: consumer._id,
        messageType: "text",
        sender: req.user!._id,
        text: message,
        ticket,
        type: "sent",
      },
      session
    );
    return res.status(200).json({ message: "message sent." });
  }
);
