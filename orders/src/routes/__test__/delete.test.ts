import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Koncert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  return ticket;
};

it("has a route handler listening to /api/order for delete requests", async () => {
  const orderId = new mongoose.Types.ObjectId();
  const response = await request(app).delete(`/api/orders/${orderId}`).send({});
  expect(response.status).not.toEqual(404);
});

it("returns 401 if user is NOT logged in", async () => {
  const response = await request(app).get("/api/orders").send({});
  expect(response.status).toEqual(401);
});

it("returns anything else but 401 if user is logged in", async () => {
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns a 400 if invalid orderId is supplied", async () => {
  await request(app)
    .delete(`/api/orders/34455`)
    .set("Cookie", signup())
    .send()
    .expect(400);
});

it("returns a 401 if order does not belong to the user logged in", async () => {
  const ticket = await buildTicket();

  const user = signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", signup())
    .send()
    .expect(401);
});

it("canceles the order", async () => {
  const ticket = await buildTicket();

  const user = signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("publishes an order cancelled event", async () => {
  const ticket = await buildTicket();

  const user = signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
