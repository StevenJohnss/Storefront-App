import { ORDER, OrderStore } from '../../order';
import { UserStore } from '../../user';
import { ProductStore } from '../../product';

const store = new OrderStore()
const uStore = new UserStore()
const pStore = new ProductStore()

describe("order Model", async () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });



  it('create method should add a order', async () => {
    const user = await uStore.create({
      id: 2000,
      username: "testuser",
      firstname: "steven",
      lastname: "john",
      password: "111"
    })
    const result = await store.create({
      id: 1,
      user_id: 2000,
      status: "open",
    });
    expect(result).toEqual({
      id: 1,
      user_id: "2000",
      status: "open",
    });
  });

  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([{
      id: 1,
      user_id: "2000",
      status: "open",
    }]);
  });

  it('show method should return the correct order', async () => {
    const result = await store.show("1");
    expect(result).toEqual({
      id: 1,
      user_id: "2000",
      status: "open",
    });
  });

  it('addProduct method should return the correct order_product', async () => {
    const product = await pStore.create({
      name: "testproduct",
      price: 20,
      id: 1000
    });
    const result = await store.addProduct(
      20,
      "1",
      "1000"
    );
    expect(result).toEqual({
      id: result.id,
      quantity: 20,
      order_id: "1",
      product_id: "1000",
    });

  });

  it('userCurrentOrder method should return the correct all users current orders', async () => {

    const result = await store.userCurrentOrder(
      "2000"
    );
    expect(result).toEqual([{
      usersid: 2000,
      username: "testuser",
      status: "open",
    }]);

  });



  it('delete method should remove the order', async () => {
    await store.delete("1");
    await uStore.delete("2000");
    await pStore.delete("1000");
    const result = await store.index()

    expect(result).toEqual([]);
  });
});