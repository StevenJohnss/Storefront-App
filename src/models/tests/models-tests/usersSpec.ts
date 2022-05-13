import { User, UserStore } from '../../user';

const store = new UserStore()

describe("user Model", () => {
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

  it('create method should add a user', async () => {
    const result = await store.create({
      id: 1,
      username: "stev",
      firstname: 'steven',
      lastname: "john",
      password: "111"
    });
    expect(result).toEqual({
      id: 1,
      username: "stev",
      firstname: 'steven',
      lastname: "john",
      password_digest: result.password_digest
    });
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([{
      id: 1,
      username: "stev",
      firstname: 'steven',
      lastname: "john",
      password_digest: result[0].password_digest
    }]);
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([{
      id: 1,
      username: "stev",
      firstname: 'steven',
      lastname: "john",
      password_digest: result[0].password_digest
    }]);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show("1");
    expect(result).toEqual({
      id: 1,
      username: "stev",
      firstname: 'steven',
      lastname: "john",
      password_digest: result.password_digest
    });
  });

  it('show method should return the correct user', async () => {
    const result = await store.authenticate("stev", "111");
    expect(result).toEqual({
      id: 1,
      username: "stev",
      firstname: 'steven',
      lastname: "john",
      password_digest: result?.password_digest
    });
  });


  it('delete method should remove the user', async () => {
    await store.delete("1");
    const result = await store.index()

    expect(result).toEqual([]);
  });
});