import { body } from "express-validator";

export const create = [
  body("name").notEmpty().toLowerCase(),
  body("parent").custom((value, { req }) => {
    if (!value) delete req.body.parent;
    return true;
  }),
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
      if (value !== 0 && value !== 1) {
        throw new Error("Invalid Ward Type");
      }
      return true;
    }),
  body("code").notEmpty().isString(),
  body("charges.*.roomRent").notEmpty().isNumeric(),
  body("charges.*.consultation").notEmpty().isNumeric(),
  body("charges.*.emergencyConsultation").notEmpty().isNumeric(),
];
