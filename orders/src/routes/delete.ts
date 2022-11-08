import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@seat-nerd/common";
import { param } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId").custom((input: string) =>
      mongoose.Types.ObjectId.isValid(input)
    ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Canceled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
