import client from '../database'

export interface ORDER {
  id?: number;
  status: string;
  user_id: number | string;
}

export class OrderStore {
  async index(): Promise<ORDER[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get orders ${err}`)

    }
  }


  async show(id: string): Promise<ORDER> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

  async create(o: ORDER): Promise<ORDER> {
    try {
      const sql = `INSERT INTO orders (status, user_id ${o.id ? ", id" : ""}) VALUES($1, $2 ${o.id ? ", $3" : ""} ) RETURNING *`
      // @ts-ignore
      const conn = await client.connect()
      const valArr = [o.status, o.user_id]
      if (o.id) valArr.push(o.id)

      const result = await conn
        .query(sql, valArr)

      const ORDER = result.rows[0]
      console.log(ORDER)
      conn.release()

      return ORDER
    } catch (err) {
      throw new Error(`Could not add new order for user ${o.user_id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<ORDER> {
    try {
      const sql_delete_constraint = `DELETE FROM order_products where order_id=${id};`
      const sql = 'DELETE FROM orders WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()
      await conn.query(sql_delete_constraint)
      const result = await conn.query(sql, [id])

      const ORDER = result.rows[0]

      conn.release()

      return ORDER
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`)
    }
  }


  addProduct = async (quantity: number, orderId: string, productId: string): Promise<{
    id: number,
    quantity: number, order_id: string, product_id: string
  }> => {
    // get order to see if it is open
    try {
      const order = await this.show(orderId)

      if (order.status !== "open") {
        throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
      }

    } catch (err) {
      throw new Error(`${err}`)
    }

    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      //@ts-ignore
      const conn = await client.connect()

      const result = await conn
        .query(sql, [quantity, orderId, productId])

      const order_products = result.rows[0]

      conn.release()

      return order_products
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
    }
  }


  async userCurrentOrder(id: string): Promise<{ username: string, status: string, usersid: number }[]> {
    try {
      //@ts-ignore
      const conn = await client.connect()
      const sql = `SELECT username, status, users.id as usersId FROM users INNER JOIN orders ON users.id = orders.user_id 
      where users.id= ${id}`

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`)
    }
  }

}