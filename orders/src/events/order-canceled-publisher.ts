import { OrderCanceledEvent, Publisher, Subjects } from "@seat-nerd/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
