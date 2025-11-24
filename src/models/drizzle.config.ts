import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/models/schemas/*',
  out: './src/models/drizzle',
  casing: 'snake_case',
  dbCredentials: {
    host: process.env.HOST ?? '',
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME ?? ''
  }
})
