import { PRODUCT } from '../../product';
import { User } from '../../user';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app from '../../../server';
import { Decoded } from '../../../utils';
import 'dotenv/config'

const request: supertest.SuperTest<supertest.Test> = supertest(app);


describe("Product Handler", () => {
  let user: User;
  let token: string;
  let product: PRODUCT;

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


  it('posts to /products (valid params) and creates a product', async () => {
    let response = await request
      .post('/products')
      .send({
        name: 'Minecraft',
        price: 20,
      })
      .set('Authorization', `Bearer ${token}`);
    product = response.body as PRODUCT;

    expect(product.name).toEqual('Minecraft');
    expect(product.price).toEqual(20);
  });


  it('gets from /products/:product_id (valid id) the product', async () => {
    const response = await request
      .get(`/products/${product.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.body.name).toEqual('Minecraft');
    expect(response.body.price).toEqual(20);
  });


  it('gets from /products all of the products', async () => {
    const response = await request
      .get('/products').set('Authorization', `Bearer ${token}`);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].name).toEqual('Minecraft');
    expect(response.body[0].price).toEqual(20);
  });

  afterAll(async () => {
    await request
      .delete('/products')
      .send({ id: product.id })
      .set('Authorization', `Bearer ${token}`);

    await request
      .delete('/users')
      .send({ id: user.id })
      .set('Authorization', `Bearer ${token}`);
  });

});