import { ORDER } from '../../order';
import { User } from '../../user';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../server';
import { Decoded } from '../../../utils';
import 'dotenv/config'

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("order Handler", async () => {
  let user: User;
  let token: string;
  let order: ORDER;

  beforeAll(async () => {
    const response = await request
      .post('/users')
      .send({
        username: 'Alice',
        firstname: 'Bob',
        lastname: 'Liddell',
        password: 'Wonderland'
      });

    token = response.body as string;
    user = (jwt.verify(token, process.env.TOKEN_SECRET as string) as Decoded).user;
  });

  it('creates a valid user', async () => {
    expect(user.id).toEqual(jasmine.any(Number));
    expect(user.password_digest).toEqual(jasmine.any(String));
  });

  it('posts to /orders with user_id and status="open" (valid params) and creates order', async () => {
    const response = await request
      .post('/orders')
      .send({
        status: 'open'
      })
      .set('Authorization', `Bearer ${token}`);
    order = response.body as ORDER;

    expect(parseInt(order.user_id as unknown as string)).toEqual(user.id as number);
    expect(order.status).toEqual('open');
  });


  it('gets from /orders/users/:user_id (valid user) the order of the user', async () => {
    const response = await request
      .get(`/orders/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body[0].username).toEqual("Alice");
    expect(parseInt(response.body[0].usersid as unknown as string)).toEqual(user.id as number);
    expect(response.body[0].status).toEqual('open');
  });


  it('gets from /orders all orders', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(parseInt(response.body[0].user_id as unknown as string)).toEqual(user.id as number);
    expect(response.body[0].status).toEqual('open');
  });

  // Clean up
  afterAll(async () => {
    await request
      .delete('/orders')
      .send({ id: order.id })
      .set('Authorization', `Bearer ${token}`);

    await request
      .delete('/users')
      .send({ id: user.id })
      .set('Authorization', `Bearer ${token}`);
  });

});