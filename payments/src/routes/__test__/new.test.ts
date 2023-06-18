import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@seat-nerd/common";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signup())
    .send({
      token: "sagrgr",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when puchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup())
    .send({
      token: "sagrgr",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchusing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(userId))
    .send({
      token: "sagrgr",
      orderId: order.id,
    })
    .expect(400);
});

it("return a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
