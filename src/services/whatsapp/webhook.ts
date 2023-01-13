import { ClientSession, ObjectId } from "mongodb";
import { CONSUMER } from "../../types/consumer/consumer";
import { iTextMessage, iWebhookPayload } from "../../types/flow/webhook";
import { iStage } from "../../types/stages/stages";
import { iTicket } from "../../types/ticket/ticket";
import ErrorHandler from "../../utils/errorHandler";
import MongoService, { Collections } from "../../utils/mongo";

export const saveMessageFromWebhook = async (
  payload: iWebhookPayload,
  consumer: ObjectId,
  ticket: ObjectId
) => {
  payload.entry.map((entry) => {
    entry.changes.map((changes) => {
      changes.value.messages.map((message, mi) => {
        // finding consumer and ticket
        (async function () {
          if (message.text) {
            const saveMessage: iTextMessage = {
              consumer: consumer,
              sender: changes.value.contacts[mi].wa_id,
              text: message.text.body,
              ticket: ticket,
              type: "received",
              messageType: "text",
            };
            await MongoService.collection(Collections.MESSAGES).insertOne(saveMessage);
          } else if (message.button) {
            const saveMessage: iTextMessage = {
              consumer: consumer,
              sender: changes.value.contacts[mi].wa_id,
              text: message.button.text,
              ticket: ticket,
              type: "received",
              messageType: "text",
            };
            await MongoService.collection(Collections.MESSAGES).insertOne(saveMessage);
          } else if (message.interactive) {
            if (message.interactive.type === "button_reply") {
              const saveMessage: iTextMessage = {
                consumer: consumer,
                sender: changes.value.contacts[mi].wa_id,
                text: message.interactive.button_reply.title,
                ticket: ticket,
                type: "received",
                messageType: "text",
              };
              await MongoService.collection(Collections.MESSAGES).insertOne(saveMessage);
            } else {
              const saveMessage: iTextMessage = {
                consumer: consumer,
                sender: changes.value.contacts[mi].wa_id,
                text:
                  message.interactive.list_reply.title + "\n\n" + message.interactive.list_reply.description,
                ticket: ticket,
                type: "received",
                messageType: "text",
              };
              await MongoService.collection(Collections.MESSAGES).insertOne(saveMessage);
            }
          }
        })();
      });
    });
  });
};

export const saveTextMessage = async (message: iTextMessage, session: ClientSession) => {
  await MongoService.collection(Collections.MESSAGES).insertOne(message, { session });
};

export const saveFlowMessages = async (ticket: ObjectId, node: ObjectId) => {
  await MongoService.collection(Collections.MESSAGES).insertOne({
    ticket,
    type: "flow",
    node,
  });
};

export const findConsumerFromWAID = async (consumerWAId: string) => {
  const stages = await MongoService.collection(Collections.STAGE).find<iStage>({}).toArray();
  console.log(consumerWAId);
  const consumer = await MongoService.collection(Collections.CONSUMER).findOne<CONSUMER>({
    phone: consumerWAId,
  });
  if (consumer === null) throw new Error("No Consumer Found");
  const tickets = await MongoService.collection(Collections.TICKET)
    .find<iTicket>({
      consumer: consumer._id,
    })
    .toArray();
  const ticket = tickets.find(
    (item) => stages.find((stage) => stage._id?.toString() === item.stage.toString())!.code < 8
  );
  if (!ticket) throw new Error("No Ticket Found");
  return { ticket: ticket._id!, consumer: consumer._id };
};
