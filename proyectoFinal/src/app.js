import express, { json, urlencoded } from 'express'
import path from 'path'
import productsRouter from './routes/products.route.js'
import cartsRouter from './routes/carts.route.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import ProductManager from './productManager.js'
import mongoose from 'mongoose'
import productsModel from './models/products.model.js'
import exphbs from 'express-handlebars';
import cartsModel from './models/cart.model.js'


const productManager = new ProductManager('./entregables/products.json')

const app = express()
const PORT = 8080

app.use(json())
app.use(urlencoded({ extended: true }))

const hbs = exphbs.create({
    // Definir helpers personalizados aquí
    helpers: {
        ifEquals: function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
});

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", productsRouter)
app.use("/", cartsRouter)

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const socketServer = new Server(httpServer)

socketServer.on('connection', async (socketServer) => {
    const products = await productManager.getProducts()
    socketServer.emit('products', products)

    socketServer.on('createProduct', async (newProduct) => {
        await productManager.createProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit('products', updatedProducts);
    });

})
app.set('socketServer', socketServer);

const environment = async () => {
    await mongoose.connect("mongodb+srv://juanmaromeroperalta9:juanmaromerop@cluster0.sbp6rso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        .then(() => {
            console.log("Conectado a la base de datos");
        }).catch(() => {
            console.error("No se pudo conecta a la base de datos", error);
        })

}

environment()


