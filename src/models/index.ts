import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const poolConnection = mysql.createPool({
  host: process.env.HOST ?? '',
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME ?? ''
})

const db = drizzle(poolConnection, { casing: 'snake_case' })

export default db
