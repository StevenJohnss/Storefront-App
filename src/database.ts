import dotenv from "dotenv"
import { Pool } from 'pg'
dotenv.config()

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  NODE_ENV,
  DB_PORT
} = process.env

let client: any
console.log("my enviroment is ", NODE_ENV, typeof (NODE_ENV))

if (NODE_ENV === 'dev') {
  console.log("in here dev")
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: (DB_PORT as unknown) as number
  })
}

else if (NODE_ENV === 'test') {
  console.log("in here test")
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: (DB_PORT as unknown) as number
  })
}
export default client