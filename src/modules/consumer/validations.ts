import { body } from "express-validator";

export const create = [
  body("firstName").notEmpty().toLowerCase(),
  body("lastName").notEmpty().toLowerCase(),
  body("email").isEmail().toLowerCase(),
  body("dob").toDate().notEmpty(),
  body("phone")
    .isMobilePhone("en-IN")
    .customSanitizer((value) => "91" + value),
  body("uid").notEmpty(),
  body("gender")
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== "M" && value !== "F" && value !== "O") {
        throw Error("Invalid Value");
      }
      return value;
    }),
];
