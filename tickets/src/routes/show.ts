import { NotFoundError } from "@seat-nerd/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticketId = req.params.id;

  const foundTicket = await Ticket.findById(ticketId);

  if (!foundTicket) {
    throw new NotFoundError();
  }

  res.status(200).send(foundTicket);
});

export { router as showTicketRouter };
