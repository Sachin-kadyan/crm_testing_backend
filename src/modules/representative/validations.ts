import { body } from "express-validator";

export const create = [
  body("firstName").notEmpty().toLowerCase(),
  body("lastName").notEmpty().toLowerCase(),
  body("email").isEmail().toLowerCase(),
  body("role")
    .notEmpty()
    .custom((value, { req }) => {
      const index = ["SUPPORT", "REPRESENTATIVE", "LEADER", "MANAGER", "EXECUTIVE", "ADMIN"].findIndex(
        (item) => item === value
      );
      if (index === -1) throw new Error("Invalid Role");
      return value;
    }),
  body("phone").isMobilePhone("en-IN"),
  body("image").notEmpty(),
  body("password").notEmpty().isStrongPassword({ minLength: 6 }),
];

export const login = [body("email").isEmail().toLowerCase(), body("password").notEmpty()];
