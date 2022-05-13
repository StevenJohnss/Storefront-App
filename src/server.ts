import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from "cors"
import usersRoutes from "./handlers/users"
import orderRoutes from "./handlers/orders_route"
import productsRoutes from "./handlers/products_route"


const app: express.Application = express()
const address: string = "localhost:3000"

const corsOptions = {
    origin: 'http://someotherdomain.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various
}
app.use(cors(corsOptions))
// app.use(articles)
app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})
usersRoutes(app)
orderRoutes(app)
productsRoutes(app)
app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app