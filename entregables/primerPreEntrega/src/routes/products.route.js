const express = require('express')
const router = express.Router()
const ProductManager = require('../productManager.js')
const filePath = './entregables/products.json'
const productManager = new ProductManager(filePath)

router.get("/api/products", async (req, res) => {
    const limit = parseInt(req.query.limit);
    res.json(await productManager.getProducts(limit))
});

router.get("/api/products/:id", async (req, res) => {
    const productsID = req.params.id
    const productResponse = await productManager.getProductById(productsID)
    
    if (!productResponse) {
        res.status(404).json(productResponse)
    } else {
        res.json(productResponse)
    }
})

router.post("/api/products", async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body
    res.json(await productManager.createProduct(title, description, code, price, status, stock, category))
})

router.put("/api/products/:id", async (req, res) => {
    const productsID = req.params.id
    const { title, description, code, price, status, stock, category } = req.body
    res.json(await productManager.updateProductById(title, description, code, price, status, stock, category, productsID))
})

router.delete("/api/products/:id", async (req, res) => {
    const productsID = req.params.id
    res.json(await productManager.deleteProductById(productsID))
})

module.exports = router