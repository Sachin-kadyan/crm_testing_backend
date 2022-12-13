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

export const createEstimate = [
  body("icuType")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("service.*.id")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("service.*.isSameSite").notEmpty().isBoolean(),
  body("investigation.*")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("procedure.*")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("creator")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("prescription")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value)),
  body("ticket")
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value)),
  body("type")
    .notEmpty()
    .isNumeric()
    .custom((value, { req }) => {
      if (value !== 0 || value !== 1) {
        throw new Error("invalid estimate type");
      }
    }),
  body("wardDays").notEmpty().isNumeric(),
  body("icuDays").notEmpty().isNumeric(),
  body("isEmergency").notEmpty().isBoolean(),
  body("paymentType")
    .notEmpty()
    .isNumeric()
    .custom((value, { req }) => {
      if (value !== 0 || value !== 1 || value !== 2) {
        throw new Error("invalid payment type");
      }
    }),
  body("insuranceCompany").notEmpty().isString(),
  body("insurancePolicyNumber").notEmpty().isString(),
  body("insurancePolicyAmount").notEmpty().isNumeric(),
  body("investigationAmount").notEmpty().isNumeric(),
  body("procedureAmount").notEmpty().isNumeric(),
  body("medicineAmount").notEmpty().isNumeric(),
  body("equipmentAmount").notEmpty().isNumeric(),
  body("bloodAmount").notEmpty().isNumeric(),
  body("additionalAmount").notEmpty().isNumeric(),
];
