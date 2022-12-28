import { body } from "express-validator";
import { ObjectId } from "mongodb";

export const create = [
  body("*.name").notEmpty().toLowerCase(),
  body("*.serviceId").notEmpty(),
  body("*.department")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
  body("*.departmentType")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
  body("*.tag")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
  body("*.opdCharge").notEmpty().toInt().isNumeric(),
  body("*.ipdCharge").notEmpty().toInt().isNumeric(),
  body("*.fourSharingRoomCharge").notEmpty().toInt().isNumeric(),
  body("*.twinSharingRoomCharge").notEmpty().toInt().isNumeric(),
  body("*.singleRoomCharge").notEmpty().toInt().isNumeric(),
  body("*.deluxeRoomCharge").notEmpty().toInt().isNumeric(),
  body("*.vipRoomCharge").notEmpty().toInt().isNumeric(),
];
