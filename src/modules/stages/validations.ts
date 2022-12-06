import { body } from "express-validator";

export const create = [
  body("name").notEmpty().isString(),
  body("description").notEmpty().isString(),
  body("parent").optional().notEmpty().isString(),
  body("code").notEmpty().isNumeric(),
];
