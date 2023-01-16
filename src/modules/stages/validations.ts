import { body } from "express-validator";
import { ObjectId } from "mongodb";

export const create = [
  body("name").notEmpty().isString(),
  body("description").notEmpty().isString(),
  body("parent")
    .optional({ nullable: true })
    .isHexadecimal()
    .bail()
    .customSanitizer((value) => new ObjectId(value)),
  body("code").notEmpty().isNumeric(),
];
