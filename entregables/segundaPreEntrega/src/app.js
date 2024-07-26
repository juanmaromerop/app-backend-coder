import express, { json, urlencoded } from 'express'
import path from 'path'
import productsRouter from './routes/products.route.js'
import cartsRouter from './routes/carts.route.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import ProductManager from '../src/productManager.js'

const productManager = new ProductManager('./entregables/products.json')

const app = express()
const PORT = 8080

app.use(json())
app.use(urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use("/", viewsRouter)

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const socketServer = new Server(httpServer)

// let products = [];
// (async () =>{
//      products = await productManager.getProducts()
// })();

socketServer.on('connection', async (socketServer) => {
    console.log("Nuevo cliente conectado");
    const products = await productManager.getProducts()
    socketServer.emit('products', products)

    socketServer.on('createProduct', async (newProduct) => {
        await productManager.createProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit('products', updatedProducts);
    });

})

app.set('socketServer', socketServer);

