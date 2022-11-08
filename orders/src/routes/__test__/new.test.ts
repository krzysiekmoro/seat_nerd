import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("has a route handler listening to /api/order for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("returns 401 if user is NOT logged in", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).toEqual(401);
});

it("returns anything else but 401 if user is logged in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({});
  expect(response.status).not.toEqual(404);
});

it("return an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId })
    .expect(404);
});

it("return an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({ title: "Koncert", price: 20 });
  await ticket.save();

  const order = Order.build({
    userId: "kjfkdjkf",
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({ title: "Koncert", price: 20 });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});
