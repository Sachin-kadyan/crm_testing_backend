import { body } from "express-validator";
import { ObjectId } from "mongodb";

export const create = [
  body("*.name").notEmpty().toLowerCase(),
  body("*.serviceId").notEmpty(),
  body("*.department").notEmpty(),
  body("*.departmentType").notEmpty(),
  body("*.opdCharge").notEmpty().isNumeric(),
  body("*.ipdCharge").notEmpty().isNumeric(),
  body("*.fourSharingRoomCharge").notEmpty().isNumeric(),
  body("*.twinSharingRoomCharge").notEmpty().isNumeric(),
  body("*.singleRoomCharge").notEmpty().isNumeric(),
  body("*.deluxeRoomCharge").notEmpty().isNumeric(),
  body("*.vipRoomCharge").notEmpty().isNumeric(),
];
