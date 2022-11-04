import { Publisher, Subjects, TicketUpdatedEvent } from "@seat-nerd/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
