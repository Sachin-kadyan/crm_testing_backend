import { body } from "express-validator";
import { ObjectId } from "mongodb";

export const create = [
  body("consumer")
    .notEmpty()
    .customSanitizer((value) => {
      return new ObjectId(value);
    }),
  body("departments").notEmpty(),
  body("doctor")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("condition").notEmpty().isString().toLowerCase(),
  body("symptoms").notEmpty().isString(),
  body("followUp").notEmpty().toDate().notEmpty(),
  body("medicines").optional(),
  body("diagnostics").optional(),
  body("admission").optional(),
];
