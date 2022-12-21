import { body } from "express-validator";

export const createReplyNode = [
  body("*.nodeId").isString().notEmpty(),
  body("*.nodeName").isString().notEmpty(),
  body("*.headerType")
    .isString()
    .notEmpty()
    .custom((value, { req }) => {
      if (
        value.toLowerCase() === "image" ||
        value.toLowerCase() === "video" ||
        value.toLowerCase() === "document"
      ) {
        const headerLinkCheck = req.body.every((item: any) => item.headerLink !== "");
        console.log(headerLinkCheck);
        if (!headerLinkCheck) {
          throw new Error("Please specify link in headerLink");
        }
      } else if (value.toLowerCase() !== "none") {
        throw new Error("Please specify header type");
      }
      return true;
    }),
  body("*.body").optional().isString().isLength({ max: 1024 }),
  body("*.footer").optional().isString().isLength({ max: 60 }),
  body("*.replyButton1").notEmpty().isString().isLength({ max: 20, min: 1 }),
  body("*.replyButtonId1").notEmpty().isString(),
  body("*.replyButton2").optional().isString().isLength({ max: 20, min: 1 }),
  body("*.replyButtonId2").optional().notEmpty().isString(),
  body("*.replyButton3").optional().isString().isLength({ max: 20, min: 1 }),
  body("*.replyButtonId3").optional().notEmpty().isString(),
];
