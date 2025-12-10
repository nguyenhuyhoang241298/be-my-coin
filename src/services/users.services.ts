import { eq } from 'drizzle-orm'
import db from '~/models'
import { NewUser, User, users } from '~/models/schemas/user'

export const getManyUsers = async () => {
  return await db.select().from(users)
}

export const insertUser = async (newUser: NewUser) => {
  return await db.insert(users).values(newUser)
}

export const insertUserReturnId = async (newUser: NewUser) => {
  return await db.insert(users).values(newUser).$returningId()
}

export const updateUserById = async (id: number, updateUser: User) => {
  return await db.update(users).set(updateUser).where(eq(users.id, id))
}

export const getUserById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user
}

export const getUserByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email))
}

export const deleteUserById = async (id: number) => {
  return await db.delete(users).where(eq(users.id, id))
}
