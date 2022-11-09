import { OrderCreatedEvent, Publisher, Subjects } from "@seat-nerd/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
