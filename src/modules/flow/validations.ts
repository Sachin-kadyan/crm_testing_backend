import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

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
  next();
};
