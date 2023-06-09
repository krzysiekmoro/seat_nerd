import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'Koncert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  return ticket;
};

it('has a route handler listening to /api/order for get requests', async () => {
  const response = await request(app).get('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});

it('returns 401 if user is NOT logged in', async () => {
  const response = await request(app).get('/api/orders').send({});
  expect(response.status).toEqual(401);
});

it('returns anything else but 401 if user is logged in', async () => {
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('fetches orders for a user', async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = signup();
  const userTwo = signup();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ticketId: ticketOne.id})
    .expect(201);
  const {body: orderOne} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ticketId: ticketTwo.id})
    .expect(201);
  const {body: orderTwo} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ticketId: ticketThree.id})
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
