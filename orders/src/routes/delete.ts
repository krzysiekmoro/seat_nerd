import express, {Request, Response} from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@seat-nerd/common';
import {param} from 'express-validator';
import mongoose from 'mongoose';
import {Order} from '../models/order';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher';
import {natsWrapper} from '../nats-wrapper';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
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

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {id: order.ticket.id},
      version: order.version,
    });

    res.status(204).send(order);
  },
);

export {router as deleteOrderRouter};
