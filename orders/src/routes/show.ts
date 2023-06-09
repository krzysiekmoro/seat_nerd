import express, {Request, Response} from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@seat-nerd/common';
import {Order} from '../models/order';
import {param} from 'express-validator';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId').custom((input: string) =>
      mongoose.Types.ObjectId.isValid(input),
    ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  },
);

export {router as showOrderRouter};
