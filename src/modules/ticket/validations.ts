import { body } from "express-validator";

export const create = [
  body("consumer").notEmpty(),
  body("specialty").notEmpty(),
  body("doctor").notEmpty().toLowerCase(),
  body("condition").notEmpty().toLowerCase(),
  body("symptoms").notEmpty().isNumeric(),
  body("followUp").notEmpty().isNumeric(),
  body("medicines").notEmpty().isNumeric(),
  body("diagnostic").notEmpty().isNumeric(),
  body("singleRoomCharge").notEmpty().isNumeric(),
  body("deluxeRoomCharge").notEmpty().isNumeric(),
  body("vipRoomCharge").notEmpty().isNumeric(),
];
