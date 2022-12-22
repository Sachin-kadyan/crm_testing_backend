import { ClientSession } from "mongodb";
import { sendMessage } from "../../services/whatsapp/whatsapp";
import { iReplyNode } from "../../types/flow/reply";
import ErrorHandler from "../../utils/errorHandler";
import MongoService, { Collections } from "../../utils/mongo";

export const createReplyNode = async (nodes: iReplyNode[], session: ClientSession) => {
  return await MongoService.collection(Collections.FLOW).insertMany(nodes, { session });
};

const findNodeWithId = async (nodeId: string) => {
  return await MongoService.collection(Collections.FLOW).findOne<iReplyNode>({ nodeId });
};

export const createReplyPayload = (node: iReplyNode) => {
  const payload: {
    type: string;
    interactive: {
      type: "button";
      body: { text: string };
      footer?: string;
      action: {
        buttons: {
          type: "reply";
          reply: {
            id: string;
            title: string;
          };
        }[];
      };
    };
  } = {
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: node.body,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: node.replyButtonId1,
              title: node.replyButton1,
            },
          },
        ],
      },
    },
  };

  if (node.footer) {
    payload.interactive.footer = node.footer;
  }
  if (node.replyButton2) {
    payload.interactive.action.buttons.push({
      type: "reply",
      reply: {
        id: node.replyButtonId2!,
        title: node.replyButton2,
      },
    });
  }
  if (node.replyButton3) {
    payload.interactive.action.buttons.push({
      type: "reply",
      reply: {
        id: node.replyButtonId3!,
        title: node.replyButton3,
      },
    });
  }
  return payload;
};

export const sendReplyNode = async (nodeId: string, phoneNumber: string, withTemplate?: boolean) => {
  const node = await findNodeWithId(nodeId);
  if (node === null) throw new ErrorHandler("Invalid Node", 400);
  const replyPayload = createReplyPayload(node);
  await sendMessage(phoneNumber, replyPayload);
};
