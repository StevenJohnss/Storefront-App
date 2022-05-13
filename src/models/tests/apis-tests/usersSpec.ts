import { User } from '../../user';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../server';
import { Decoded } from '../../../utils';
import 'dotenv/config'

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("user Handler", () => {

  let token: string;
  let user: User;

  it('creates a valid user', async () => {
    const response = await request.post('/users').send({
      username: 'steve',
      firstname: 'steve',
      lastname: 'john',
      password: 'Wonderland'
    });

    token = response.body as string;
    user = (jwt.verify(token, process.env.TOKEN_SECRET as string) as Decoded).user;

    expect(user.id).toEqual(jasmine.any(Number));
    expect(user.password_digest).toEqual(jasmine.any(String));
    expect(user.username).toEqual('steve');
    expect(user.firstname).toEqual('steve');
    expect(user.lastname).toEqual('john');
  });

  it('gets from /users/:id (valid id) the user with id', async () => {
    const response = await request
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.username).toEqual('steve');
    expect(response.body.firstname).toEqual('steve');
    expect(response.body.lastname).toEqual('john');
  });

  it('gets from /users all of the users', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body[0].username).toEqual('steve');
    expect(response.body[0].firstname).toEqual('steve');
    expect(response.body[0].lastname).toEqual('john');
  });

  // Clean up
  afterAll(async () => {
    await request
      .delete('/users')
      .send({ id: user.id })
      .set('Authorization', `Bearer ${token}`);
  });

});