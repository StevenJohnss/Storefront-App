import bcrypt from "bcrypt"
import client from '../database'
import 'dotenv/config'

export type User = {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
  password_digest?: string;
}


const { SALT_ROUNDS: saltRounds, BCRYPT_PASSWORD: pepper } = process.env
export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get Users ${err}`)

    }
  }


  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`)
    }
  }

  usernameExists = async (username: string): Promise<boolean> => {
    try {
      const conn = await client.connect()
      const sql = 'select * from users where username=($1)'
      const result = await conn.query(sql, [username])
      conn.release()
      if (result.rows.length !== 0) return true
      else return false
    } catch (err) {
      throw new Error(`unable to search for user (${username}): ${err}`)
    }
  }

  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = `INSERT INTO users (username, firstname , lastname, password_digest ${u.id ? ", id" : ""}) VALUES($1, $2, $3, $4 ${u.id ? ", $5" : ""} ) RETURNING *`

      const hash = bcrypt.hashSync(
        u.password + String(pepper),
        parseInt(saltRounds as string)
      );

      const valArr = [u.username, u.firstname, u.lastname, hash]
      if (u.id) valArr.push(u.id as any)

      const result = await conn.query(sql, valArr)
      const user = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`unable create user (${u.username}): ${err}`)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = `DELETE FROM users WHERE id=${id}`
      // @ts-ignore
      const conn = await client.connect()
      const result = await conn.query(sql)

      const User = result.rows[0]
      conn.release()

      return User
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`)
    }
  }


  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await client.connect()
    const sql = 'SELECT * FROM users WHERE username=($1)'

    const result = await conn.query(sql, [username])

    console.log(password + pepper)

    if (result.rows.length) {

      const user = result.rows[0]

      console.log("User Before Cheking Password= ", user)

      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        conn.release()
        return user
      }
    }
    conn.release()
    return null
  }


  async update(u: User): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = `UPDATE users SET username = $1, firstname = $2 , lastname = $3, password_digest = $4 where id = ${u.id} RETURNING *`

      const hash = bcrypt.hashSync(
        u.password + String(pepper),
        parseInt(saltRounds as string)
      );

      const valArr = [u.username, u.firstname, u.lastname, hash]

      const result = await conn.query(sql, valArr)
      const User = result.rows[0]
      conn.release()
      return User
    }
    catch (error) {
      throw new Error(`Could not run edit query on user ${u.username}: ${error}`);
    }
  }

}