import express from 'express'
import ProductManager from '../productManager.js'

const productManager = new ProductManager('./entregables/products.json')

const router = express.Router()

const products = await productManager.getProducts()

router.get('/', (req, res) => {
    res.render('home', { products })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts')
})

router.post('/realtimeproducts', async (req, res) => {
    const newProduct = req.body;
    await productManager.createProduct(newProduct.title,
        newProduct.description,
        newProduct.code,
        newProduct.price,
        newProduct.status,
        newProduct.stock,
        newProduct.category);

    const socketServer = req.app.get('socketServer');
    const updatedProducts = await productManager.getProducts();
    socketServer.emit('products', updatedProducts);

    res.status(201).send();
});

router.delete('/realtimeproducts/:id', async (req, res) => {
    const productId = req.params.id;
    await productManager.deleteProductById(productId);

    const socketServer = req.app.get('socketServer');
    const updatedProducts = await productManager.getProducts();
    socketServer.emit('products', updatedProducts);

    res.status(200).send();
});

export default router
