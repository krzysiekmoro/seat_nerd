import { Subjects, Publisher, ExpirationCompleteEvent } from "@seat-nerd/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}