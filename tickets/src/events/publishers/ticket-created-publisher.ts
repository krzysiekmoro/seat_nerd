import { Publisher, Subjects, TicketCreatedEvent } from "@seat-nerd/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
