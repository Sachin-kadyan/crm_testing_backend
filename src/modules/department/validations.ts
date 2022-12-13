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

export const createDoctor = [
  body("name").notEmpty().toLowerCase(),
  body("department.*").notEmpty().isString(),
];
export const createDepartmentTag = [body("name").notEmpty().toLowerCase()];

export const createWard = [
  body("name").notEmpty().isString(),
  body("type")
    .notEmpty()
    .isNumeric()
    .custom((value, _) => {
      const types = new Set([1, 2]);
      if (!types.has(value)) {
        throw new Error("Invalid Ward Type");
      }
      return value;
    }),
  body("code").notEmpty().isString(),
  body("roomRent").notEmpty().isNumeric(),
  body("consultation").notEmpty().isNumeric(),
  body("emergencyConsultation").notEmpty().isNumeric(),
];
