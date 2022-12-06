import { body } from "express-validator";
import { ObjectId } from "mongodb";

export const create = [
  body("name").notEmpty().toLowerCase(),
  body("parent")
    .optional()
    .isString()
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value)),
  body("tags.*").optional().isString().notEmpty(),
];

export const createDoctor = [body("name").notEmpty().toLowerCase(), body("department.*").notEmpty().isString()];
