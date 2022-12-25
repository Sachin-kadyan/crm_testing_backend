import { body, param } from "express-validator";
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
    .optional()
    .notEmpty()
    .customSanitizer((value) => new ObjectId(value))
    .notEmpty(),
  body("procedure.*")
    .optional()
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
      if (value !== 0 && value !== 1) {
        throw new Error("Invalid estimate type");
      }
      return true;
    }),
  body("wardDays").notEmpty().isNumeric(),
  body("icuDays").notEmpty().isNumeric(),
  body("isEmergency").notEmpty().isBoolean(),
  body("paymentType")
    .notEmpty()
    .isNumeric()
    .custom((value, { req }) => {
      if (value !== 0 && value !== 1 && value !== 2) {
        throw new Error("Invalid payment type");
      }
      return true;
    }),
  body("insuranceCompany").optional().notEmpty().isString(),
  body("insurancePolicyNumber").optional().notEmpty().isString(),
  body("insurancePolicyAmount").optional().notEmpty().isNumeric(),
  body("investigationAmount").optional().notEmpty().isNumeric(),
  body("procedureAmount").optional().notEmpty().isNumeric(),
  body("medicineAmount").optional().notEmpty().isNumeric(),
  body("equipmentAmount").optional().notEmpty().isNumeric(),
  body("bloodAmount").optional().notEmpty().isNumeric(),
  body("additionalAmount").optional().notEmpty().isNumeric(),
];

export const get_estimate = [param("ticketId").notEmpty()];

export const create_note = [
  body("text").notEmpty().isString(),
  body("ticket")
    .notEmpty()
    .isString()
    .custom((value) => new ObjectId(value)),
];
