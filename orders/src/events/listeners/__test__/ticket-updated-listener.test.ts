import {TicketUpdatedEvent} from '@seat-nerd/common';
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';
import {natsWrapper} from '../../../nats-wrapper';
import {TicketUpdatedListener} from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'Concert',
    price: 30,
    id: ticketId,
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Concert',
    price: 500,
    userId: 'hfkhkhfkf',
    version: ticket.version + 1,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {listener, ticket, data, message};
};

it('finds, updates and saves the ticket', async () => {
  const {listener, ticket, data, message} = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acknowledges the message', async () => {
  const {listener, data, message} = await setup();

  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it('doesnt call ack if the event has version number out of order', async () => {
  const {listener, data, message} = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (err) {
    console.log(err);
  }

  expect(message.ack).not.toHaveBeenCalled();
});
