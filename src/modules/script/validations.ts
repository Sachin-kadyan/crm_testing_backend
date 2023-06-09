import { body, param, query } from "express-validator";
import { ObjectId } from "mongodb";

export const create_script = [
  body("text").notEmpty().isString(),
  body("service")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
  body("stage")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
];

export const get_script = [
  param("serviceId")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
  param("stageId")
    .notEmpty()
    .isString()
    .customSanitizer((value) => new ObjectId(value)),
];

export const get_scripts = [
  query("pageLength").notEmpty().bail().isInt().bail().toInt(),
  query("page").notEmpty().bail().isInt().bail().toInt(),
];
