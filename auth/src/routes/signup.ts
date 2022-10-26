import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, validateRequest } from "@seat-nerd/common";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters long"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check DB for user and create new one
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email address already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // Create JWT for user and save it in session
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
