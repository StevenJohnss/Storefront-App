import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export interface Decoded {
  user: {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
    password_digest: string
  },
  iat: number
}

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)
    console.log("Decoded = ", decoded)
    //(<any>decoded).user
    req.body.user = (decoded as Decoded).user
    next()
  } catch (error: any) {
    console.log(error)
    res.status(401).send("invalid token with " + error.message as string)
  }
}
