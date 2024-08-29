import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email").isEmail(),
  body("name", "Name must have min 3 symbols").isLength({ min: 3 }),
  body("password", "Password must have min 3 symbols").isLength({ min: 5 }),
  body("avatarUrl", "Wrong avatar URL").optional().isURL(),
];

export const loginValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must have min 3 symbols").isLength({ min: 5 }),
];

export const postCreateValidation = [
  body("title", "Enter title article").isLength({ min: 3 }).isString(),
  body("text", "Enter text article").isLength({ min: 3 }).isString(),
  body("tags", "Wrong tag format ").optional().isArray(),
  body("imageUrl", "Wrong image link").optional().isString(),
];
