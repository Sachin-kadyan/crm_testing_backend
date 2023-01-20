import { ObjectID } from "bson";
import { NextFunction, Request, Response } from "express";
import { body, query } from "express-validator";

export const createReply = (req: Request, res: Response, next: NextFunction) => {
  const nodes: {
    nodeId: string;
    nodeName: string;
    headerType: "image" | "document" | "video" | "none";
    headerLink: string;
    body: string;
    footer: string;
    replyButton1: string;
    replyButtonId1: string;
    replyButton2: string;
    replyButtonId2: string;
    replyButton3: string;
    replyButtonId3: string;
  }[] = req.body;

  nodes.forEach((item, index) => {
    if (!item.nodeId) throw new Error(`Invalid node id at index ${index}`);
    if (!item.nodeName) throw new Error(`Invalid node name at index ${index}`);
    if (
      item.headerType.toLowerCase() !== "none" &&
      item.headerType.toLowerCase() !== "image" &&
      item.headerType.toLowerCase() !== "document" &&
      item.headerType.toLowerCase() !== "video"
    ) {
      throw new Error(`Please specify header type at index ${index}`);
    }
    if (item.headerType.toLowerCase() !== "none" && item.headerLink === "") {
      throw new Error(`Please provide header link at index ${index}`);
    }
    if (item.headerType.toLowerCase() === "none") {
      delete req.body[index].headerType;
      delete req.body[index].headerLink;
    }
    // body
    if (item.body.length > 1024 || item.body.length === 0) {
      throw new Error(`body at index ${index} have more than 1024 or 0 characters.`);
    }

    if (item.body === "") {
      delete req.body[index].body;
    }

    // footer
    if (item.footer.length > 60) {
      throw new Error(`Footer length cannot be greater than 60 characters at index ${index}`);
    }
    if (item.footer.toLowerCase() === "none" || item.footer.length === 0) {
      delete req.body[index].footer;
    }

    // reply buttons

    if (item.replyButton1 === "" || item.replyButtonId1 === "") {
      throw new Error(`Please specify button name or id at index ${index}`);
    }

    if (item.replyButton1.length > 20) {
      throw new Error(`Button Name length greater than 20 characters at index ${index}`);
    }
    if (item.replyButton2.length > 20) {
      throw new Error(`Button2 name length greater than 20 characters at index ${index}`);
    }
    if (item.replyButton2 === "") {
      delete req.body[index].replyButton2;
      delete req.body[index].replyButtonId2;
    }
    if (item.replyButton3.length > 20) {
      throw new Error(`Button2 name length greater than 20 characters at index ${index}`);
    }
    if (item.replyButton3 === "") {
      delete req.body[index].replyButton3;
      delete req.body[index].replyButtonId3;
    }
  });
  req.body.forEach((_: any, index: number) => {
    req.body[index].type = "reply";
  });
  next();
};

export const createList = (req: Request, res: Response, next: NextFunction) => {
  const nodes: {
    nodeId: string;
    nodeName: string;
    headerType: "image" | "document" | "video" | "none";
    headerLink: string;
    body: string;
    footer: string;
    listId0: string;
    listTitle0: string;
    listDesc0: string;
    listId1: string;
    listTitle1: string;
    listDesc1: string;
    listId2: string;
    listTitle2: string;
    listDesc2: string;
    listId3: string;
    listTitle3: string;
    listDesc3: string;
    listId4: string;
    listTitle4: string;
    listDesc4: string;
    listId5: string;
    listTitle5: string;
    listDesc5: string;
    listId6: string;
    listTitle6: string;
    listDesc6: string;
    listId7: string;
    listTitle7: string;
    listDesc7: string;
    listId8: string;
    listTitle8: string;
    listDesc8: string;
    listId9: string;
    listTitle9: string;
    listDesc9: string;
  }[] = req.body;

  nodes.forEach((item, index) => {
    if (!item.nodeId) throw new Error(`Invalid node id at index ${index}`);
    if (!item.nodeName) throw new Error(`Invalid node name at index ${index}`);
    if (
      item.headerType.toLowerCase() !== "none" &&
      item.headerType.toLowerCase() !== "image" &&
      item.headerType.toLowerCase() !== "document" &&
      item.headerType.toLowerCase() !== "video"
    ) {
      throw new Error(`Please specify header type at index ${index}`);
    }
    if (item.headerType.toLowerCase() !== "none" && item.headerLink === "") {
      throw new Error(`Please provide header link at index ${index}`);
    }
    if (item.headerType.toLowerCase() === "none") {
      delete req.body[index].headerType;
      delete req.body[index].headerLink;
    }
    // body
    if (item.body.length > 1024 || item.body.length === 0) {
      throw new Error(`body at index ${index} have more than 1024 or 0 characters.`);
    }

    if (item.body === "") {
      delete req.body[index].body;
    }

    // footer
    if (item.footer.length > 60) {
      throw new Error(`Footer length cannot be greater than 60 characters at index ${index}`);
    }
    if (item.footer.toLowerCase() === "none" || item.footer.length === 0) {
      delete req.body[index].footer;
    }

    // reply buttons

    if (item.listId0 === "" || item.listTitle0 === "") {
      throw new Error(`Please specify button name or id at index ${index}`);
    }

    if (
      item.listTitle0.length > 24 ||
      item.listTitle1.length > 24 ||
      item.listTitle2.length > 24 ||
      item.listTitle3.length > 24 ||
      item.listTitle4.length > 24 ||
      item.listTitle5.length > 24 ||
      item.listTitle6.length > 24 ||
      item.listTitle7.length > 24 ||
      item.listTitle8.length > 24 ||
      item.listTitle9.length > 24
    ) {
      throw new Error(`list title length greater than 24 characters at index ${index}`);
    }

    if (
      item.listDesc0.length > 72 ||
      item.listDesc1.length > 72 ||
      item.listDesc2.length > 72 ||
      item.listDesc3.length > 72 ||
      item.listDesc4.length > 72 ||
      item.listDesc5.length > 72 ||
      item.listDesc6.length > 72 ||
      item.listDesc7.length > 72 ||
      item.listDesc8.length > 72 ||
      item.listDesc9.length > 72
    ) {
      throw new Error(`list title length greater than 72 characters at index ${index}`);
    }

    if (item.listTitle1 === "") {
      delete req.body[index].listId1;
      delete req.body[index].listDesc1;
      delete req.body[index].listTitle1;
    }
    if (item.listTitle2 === "") {
      delete req.body[index].listId2;
      delete req.body[index].listDesc2;
      delete req.body[index].listTitle2;
    }
    if (item.listTitle3 === "") {
      delete req.body[index].listId3;
      delete req.body[index].listDesc3;
      delete req.body[index].listTitle3;
    }
    if (item.listTitle4 === "") {
      delete req.body[index].listId4;
      delete req.body[index].listDesc4;
      delete req.body[index].listTitle4;
    }
    if (item.listTitle5 === "") {
      delete req.body[index].listId5;
      delete req.body[index].listDesc5;
      delete req.body[index].listTitle5;
    }
    if (item.listTitle6 === "") {
      delete req.body[index].listId6;
      delete req.body[index].listDesc6;
      delete req.body[index].listTitle6;
    }
    if (item.listTitle7 === "") {
      delete req.body[index].listId7;
      delete req.body[index].listDesc7;
      delete req.body[index].listTitle7;
    }
    if (item.listTitle8 === "") {
      delete req.body[index].listId8;
      delete req.body[index].listDesc8;
      delete req.body[index].listTitle8;
    }
    if (item.listTitle9 === "") {
      delete req.body[index].listId9;
      delete req.body[index].listDesc9;
      delete req.body[index].listTitle9;
    }
  });
  req.body.forEach((_: any, index: number) => {
    req.body[index].type = "list";
  });
  next();
};

export const connect_flow = [
  body("serviceId")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectID(value)),
  body("templateName").notEmpty().isString(),
  body("templateLanguage").notEmpty().isString(),
  body("templateIdentifier").notEmpty().isString(),
  body("nodeIdentifier").notEmpty().isString(),
  body("nodeId")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectID(value)),
];

export const send_message = [
  body("message").isString().notEmpty(),
  body("consumerId")
    .notEmpty()
    .customSanitizer((value) => new ObjectID(value)),
];

export const searchFlowNode = [query("flowQuery").notEmpty().isString()];

export const get_flow_connector = [
  query("pageLength").notEmpty().isInt({ max: 50 }).toInt(),
  query("page").notEmpty().isInt().toInt(),
];
