const express = require('express')
const router = express.Router()
const fs = require('fs')

const filePath = 'products.json'

const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const writeProductsFromFile = (products) => {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2))
}




router.get("/api/products", (req, res) => {
    const products = readProductsFromFile()
    res.json(products)
})
router.get("/api/products/:id", (req, res) => {
    const products = readProductsFromFile()
    const productsID = parseInt(req.params.id)
    const product = products.find((res) => res.id === productsID)
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: "Error, no se encontro ningun producto" })
    }
})

router.post("/api/products", (req, res) => {
    const products = readProductsFromFile()
    const { title, description, code, price, status, stock, category } = req.body
    const newProduct = { id: products.length + 1, title: title, description: description, code: code, price: price, status: status, stock: stock, category: category }
    // const newProduct = req.body
    // const resultProduct = { id: products.length + 1, ...newProduct, status: true}
    products.push(newProduct)
    writeProductsFromFile(products)
    res.json({ message: "Producto agregado correctamente" })
})

router.put("/api/products/:id", (req, res) => {
    const products = readProductsFromFile()
    const productsID = parseInt(req.params.id)
    const product = products.find((res) => res.id === productsID)
    if (product) {
        const { title, description, code, price, stock, category } = req.body
        product.title = title
        product.description = description
        product.code = code
        product.price = price
        product.stock = stock
        product.category = category
        writeProductsFromFile(products)
        res.json(product)
    } else {
        res.status(404).json({ message: "Error, no se pudo actualizar el producto" })
    }
})

router.delete("/api/products/:id", (req, res) => {
    const products = readProductsFromFile()
    const productsID = parseInt(req.params.id)
    const productIndex = products.findIndex((res) => res.id === productsID)
    if (productIndex !== -1) {
        products.splice(productIndex, 1)
        writeProductsFromFile(products)
        res.json({ message: "Producto eliminado correctamente" })
    } else {
        res.status(404).json({ message: "Error, no se encontro ningun producto" })
    }
})


module.exports = router