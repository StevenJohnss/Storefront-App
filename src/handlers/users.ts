import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { verifyAuthToken } from '../utils'

const store = new UserStore()

const index = async (_req: Request, res: Response) => {
  const users = await store.index()
  res.json(users)
}

const show = async (req: Request, res: Response) => {
  console.log(req.params.id)
  const users = await store.show(req.params.id)
  res.json(users)
}

const create = async (req: Request, res: Response) => {
  console.log("in create user")
  const user: User = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  }
  try {
    const usernameExists = await store.usernameExists(user.username)
    if (usernameExists) res.send("user name taken please try another one")
    const newUser = await store.create(user)
    var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string, { expiresIn: "8h" });
    res.json(token)
  } catch (err) {
    res.status(400)
    res.json(err as string + user)
  }
}


const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  }
  try {
    const u = await store.authenticate(user.username, user.password as string)
    if (u) {
      var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string, { expiresIn: "8h" });
      res.json(token)
    }
    else res.send("Invalid Username Or password and my password is 123")
  } catch (error) {
    res.status(401)
    res.json({ error })
  }
}


const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id)
  console.log("Deleted")
  res.json(deleted)
}

const update = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  }
  const Updated = await store.update(user)
  console.log("Updated")
  res.json(Updated)
}

const usersRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.delete('/users', verifyAuthToken, destroy)
  app.put('/users', verifyAuthToken, update)
  app.post('/users', create)
  app.get('/users/authenticate/me', authenticate)
}

export default usersRoutes