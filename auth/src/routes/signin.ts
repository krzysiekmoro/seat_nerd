import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { PasswordManager } from "../services/password-manager";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage('"Email must be valid"'),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please supply password for this user"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("User does not exist. Please sign up first!");
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Wrong password");
    }

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };

    res.status(201).send(existingUser);
  }
);

export { router as signInRouter };
