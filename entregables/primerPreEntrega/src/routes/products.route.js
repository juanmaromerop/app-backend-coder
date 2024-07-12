const express = require('express')
const router = express.Router()
const ProductManager = require('../productManager.js')
const filePath = './entregables/products.json'
const productManager = new ProductManager(filePath)

router.get("/api/products", (req, res) => {
    const limit = parseInt(req.query.limit); 
     res.json(productManager.getProducts(limit))
});

router.get("/api/products/:id", (req, res) => {
    const productsID = req.params.id
    const productResponse = productManager.getProductById(productsID)
    if (!productResponse) {
        res.status(404).json(productResponse)
    } else {
        res.json(productResponse)
    }
})

router.post("/api/products", (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body
    res.json(productManager.createProduct(title, description, code, price, status, stock, category))
})

router.put("/api/products/:id", (req, res) => {
    const productsID = req.params.id
    const { title, description, code, price, status, stock, category } = req.body
    res.json(productManager.updateProductById(title, description, code, price, status, stock, category, productsID))
})

router.delete("/api/products/:id", (req, res) => {
    const productsID = req.params.id
    res.json(productManager.deleteProductById(productsID))
    // const product = getProductById(productsID)
    // if (!product) {
    //     res.status(404).json({ message: "Error, no se pudo eliminar el producto porque no existe" })
    // } else{
    //     const productsWithoutProductId = product.filter((product) => product.id !== productsID)
    //      writeProductsFromFile(productsWithoutProductId)
    //      res.status(200).json(productsWithoutProductId)
    // }

})

module.exports = router