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


console.log("my enviroment is ", NODE_ENV, typeof (NODE_ENV))
const database = (NODE_ENV === 'test') ? POSTGRES_TEST_DB : POSTGRES_DB;

const client = new Pool({
  host: POSTGRES_HOST,
  database: database,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: (DB_PORT as unknown) as number
})
export default client