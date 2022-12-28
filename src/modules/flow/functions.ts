import { ClientSession, Collection, ObjectId } from "mongodb";
import { sendMessage, sendTemplateMessage } from "../../services/whatsapp/whatsapp";
import { iFlowConnect, iListNode, iReplyNode } from "../../types/flow/reply";
import ErrorHandler from "../../utils/errorHandler";
import MongoService, { Collections } from "../../utils/mongo";

export const createReplyNode = async (nodes: iReplyNode[], session: ClientSession) => {
  return await MongoService.collection(Collections.FLOW).insertMany(nodes, { session });
};

export const createListNode = async (nodes: iListNode[], session: ClientSession) => {
  return await MongoService.collection(Collections.FLOW).insertMany(nodes, { session });
};
const findNodeWithId = async (nodeId: string) => {
  return await MongoService.collection(Collections.FLOW).findOne<iReplyNode | iListNode>({ nodeId });
};

const findNodeById = async (nodeId: ObjectId) => {
  return await MongoService.collection(Collections.FLOW).findOne<iReplyNode | iListNode>({ _id: nodeId });
};

export const findAndSendNode = async (nodeIdentifier: string, receiver: string) => {
  const node = await findNodeWithId(nodeIdentifier);
  if (node !== null && node.type === "reply") {
    await sendReplyNode(node.nodeId, receiver);
  } else if (node !== null && node.type === "list") {
  }
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

export const sendReplyNode = async (nodeId: string, phoneNumber: string) => {
  const node = await findNodeWithId(nodeId);
  if (node === null) throw new ErrorHandler("Invalid Node", 400);
  if (node.type === "reply") {
    const replyPayload = createReplyPayload(node);
    await sendMessage(phoneNumber, replyPayload);
  }
};

export const startTemplateFlow = async (templateName: string, templateLanguage: string, receiver: string) => {
  return await sendTemplateMessage(receiver, templateName, templateLanguage);
};

// connect flow

export const connectFlow = async (connector: iFlowConnect, session: ClientSession) => {
  await MongoService.collection(Collections.FLOW_CONNECT).insertOne(connector, { session });
  return connector;
};

export const findFlowConnectorByService = async (serviceId: ObjectId) => {
  return await MongoService.collection(Collections.FLOW_CONNECT).findOne<iFlowConnect>({ serviceId });
};

export const findFlowConnectorByTemplateIdentifier = async (templateIdentifier: string) => {
  return await MongoService.collection(Collections.FLOW_CONNECT).findOne<iFlowConnect>({
    templateIdentifier,
  });
};
