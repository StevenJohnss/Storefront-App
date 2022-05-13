import client from '../database'

export interface PRODUCT {
  id?: number;
  name: string;
  price: number;
}

export class ProductStore {
  async index(): Promise<PRODUCT[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get products ${err}`)

    }
  }


  async show(id: string): Promise<PRODUCT> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find PRODUCT ${id}. Error: ${err}`)
    }
  }

  async create(p: PRODUCT): Promise<PRODUCT> {
    try {
      const sql = `INSERT INTO products (name, price ${p.id ? ", id" : ""}) VALUES($1, $2 ${p.id ? ", $3" : ""} ) RETURNING *`
      // @ts-ignore
      const conn = await client.connect()
      const valArr = [p.name, p.price]
      if (p.id) valArr.push(p.id)

      const result = await conn
        .query(sql, valArr)

      const PRODUCT = result.rows[0]
      console.log(PRODUCT)
      conn.release()

      return PRODUCT
    } catch (err) {
      throw new Error(`Could not add new PRODUCT ${p.name}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<PRODUCT> {
    try {
      const sql_delete_constraint = `DELETE FROM order_products where product_id=${id};`
      const sql = `DELETE FROM products WHERE id=($1)`
      // @ts-ignore
      const conn = await client.connect()
      await conn.query(sql_delete_constraint)
      const result = await conn.query(sql, [id])

      const PRODUCT = result.rows[0]

      conn.release()

      return PRODUCT
    } catch (err) {
      throw new Error(`Could not delete PRODUCT ${id}. Error: ${err}`)
    }
  }


}