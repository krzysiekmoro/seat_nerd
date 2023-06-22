import {OrderCancelledEvent, Publisher, Subjects} from '@seat-nerd/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
