import {OrderStatus} from '@seat-nerd/common';
import mongoose from 'mongoose';
import {TicketDocument} from './ticket';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

export {OrderStatus};

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attributes: OrderAttributes): OrderDocument;
}

const orderShema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderShema.set('versionKey', 'version');
orderShema.plugin(updateIfCurrentPlugin);

orderShema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderShema);

export {Order};
