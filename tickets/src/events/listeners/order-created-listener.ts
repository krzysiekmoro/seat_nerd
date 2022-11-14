import { Listener, OrderCreatedEvent, Subjects } from "@seat-nerd/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = "";
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();

    msg.ack();
  }
}
