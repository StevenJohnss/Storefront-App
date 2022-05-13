import express, { Request, Response } from 'express'
import { PRODUCT, ProductStore } from '../models/product'
import { verifyAuthToken } from '../utils'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
  const products = await store.index()
  res.json(products)
}

const show = async (req: Request, res: Response) => {
  const products = await store.show(req.params.id)
  res.json(products)
}

const create = async (_req: Request, res: Response) => {
  try {
    const product: PRODUCT = {
      name: _req.body.name,
      price: parseInt(_req.body.price)
    }

    const newproduct = await store.create(product)
    res.json(newproduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id)
  console.log("Deleted")
  res.json(deleted)
}


const bookRoutes = (app: express.Application) => {
  app.get('/products', verifyAuthToken, index)
  app.get('/products/:id', verifyAuthToken, show)
  app.post('/products', verifyAuthToken, create)
  app.delete('/products', verifyAuthToken, destroy)
}

export default bookRoutes