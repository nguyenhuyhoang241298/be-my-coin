import express from 'express'
import {
  deleteUserById as deleteUser,
  getUserById as fetchUserById,
  getManyUsers,
  insertUser,
  updateUserById
} from '~/services/users.services'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getManyUsers()

    return res.status(200).json(users)
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}

export const getUserById = async (req: express.Request, res: express.Response) => {
  try {
    const user = await fetchUserById(res.locals.user.id)

    return res.status(200).json(user)
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}

export const addUser = async (req: express.Request, res: express.Response) => {
  try {
    const newUser = req.body
    const users = await insertUser(newUser)

    return res.status(200).json(users)
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}

export const editUserById = async (req: express.Request, res: express.Response) => {
  try {
    const body = req.body
    const users = await updateUserById(Number(body.id), body.newUser)

    return res.status(200).json(users)
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}

export const deleteUserById = async (req: express.Request, res: express.Response) => {
  try {
    await deleteUser(req.body)

    return res.status(200).json('Xóa thành công')
  } catch (e) {
    console.log(e)
    return res.sendStatus(400)
  }
}
