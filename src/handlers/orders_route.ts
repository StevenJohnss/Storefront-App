import express, { Request, Response } from 'express'
import { ORDER, OrderStore } from '../models/order'
import { verifyAuthToken } from '../utils'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (req: Request, res: Response) => {
  const orders = await store.show(req.params.id)
  res.json(orders)
}

const create = async (_req: Request, res: Response) => {
  try {
    const order: ORDER = {
      status: _req.body.status,
      user_id: parseInt(_req.body.user.id)
    }

    const newOrder = await store.create(order)
    res.json(newOrder)
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

const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id
  const productId: string = _req.body.productId
  const quantity: number = parseInt(_req.body.quantity)

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId)
    res.json(addedProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}


const userCurrentOrder = async (_req: Request, res: Response) => {
  const userid: string = _req.params.user_id
  try {
    const userCurrentOrders = await store.userCurrentOrder(userid)
    res.json(userCurrentOrders)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}
const orderUserInvoice = async (_req: Request, res: Response) => {
  const order_id: string = _req.params.order_id
  try {
    const orderUserInvoice = await store.orderUserInvoice(order_id)
    res.json(orderUserInvoice)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}


const bookRoutes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index)
  app.get('/orders/:id', verifyAuthToken, show)
  app.get('/orders/users/:user_id', verifyAuthToken, userCurrentOrder)
  app.get('/orders/invoice/:order_id', verifyAuthToken, orderUserInvoice)
  app.post('/orders', verifyAuthToken, create)
  app.delete('/orders', verifyAuthToken, destroy)
  // add product
  app.post('/orders/:id/products', verifyAuthToken, addProduct)

}

export default bookRoutes