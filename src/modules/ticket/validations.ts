import { body } from "express-validator";

export const create = [
  body("consumer").notEmpty(),
  body("specialty").notEmpty().isArray({ min: 1 }),
  body("doctor").notEmpty().isString(),
  body("condition").notEmpty().isString().toLowerCase(),
  body("symptoms").notEmpty().isString(),
  body("followUp").notEmpty().toDate().notEmpty(),
  body("medicines").optional().isArray(),
  body("diagnostics").optional().isArray(),
  body("admission").optional().isString(),
];
