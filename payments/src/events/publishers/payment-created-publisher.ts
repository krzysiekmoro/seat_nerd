import {PaymentCreatedEvent, Publisher, Subjects} from '@seat-nerd/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
