import { ObjectId } from "mongodb";
import { CONSUMER } from "../../types/consumer/consumer";
import { iTextMessage, iWebhookPayload } from "../../types/flow/webhook";
import { iStage } from "../../types/stages/stages";
import { iTicket } from "../../types/ticket/ticket";
import MongoService, { Collections } from "../../utils/mongo";

export const saveMessageFromWebhook = (payload: iWebhookPayload) => {
  payload.entry.map((entry) => {
    entry.changes.map((changes) => {
      changes.value.messages.map((message, mi) => {
        // finding consumer and ticket
        (async function () {
          const { consumer, ticket } = await findConsumerFromWAID(changes.value.contacts[mi].wa_id);
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

export const saveTextMessage = async (message: iTextMessage, sender: string) => {
  await MongoService.collection(Collections.MESSAGES).insertOne({ message });
};

export const saveFlowMessages = async (ticket: ObjectId, node: ObjectId) => {
  await MongoService.collection(Collections.MESSAGES).insertOne({
    ticket,
    type: "flow",
    node,
  });
};

export const findConsumerFromWAID = async (sender: string) => {
  const stages = await MongoService.collection(Collections.STAGE).find<iStage>({}).toArray();
  const consumer = await MongoService.collection(Collections.CONSUMER).findOne<CONSUMER>({
    phone: `/*.${sender}.*/`,
  });
  if (consumer === null) throw new Error("No Consumer Found");
  const tickets = await MongoService.collection(Collections.TICKET)
    .find<iTicket>({
      consumer: consumer._id,
    })
    .toArray();
  const ticket = tickets.find((item) => stages.find((stage) => stage._id === item.stage)!.code < 8);
  if (!ticket) throw new Error("No Ticket Found");
  return { ticket: ticket._id!, consumer: consumer._id };
};
