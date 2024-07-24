import express from 'express'
import ProductManager from '../productManager.js'

const productManager = new ProductManager('./entregables/products.json')

const router = express.Router()

const products = await productManager.getProducts()
router.get('/', (req, res) => {

    res.render('home', { products })

})

router.get('/realtimeproducts', (req, res) =>{
    res.render('realtimeproducts')
})

export default router