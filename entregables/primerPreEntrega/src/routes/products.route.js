const express = require('express')
const router = express.Router()
const fs = require('fs')

const filePath = 'products.json'

const getProductById = (id) =>{
    const products = readProductsFromFile()
    const productsID = parseInt(id)
    const product = products.find((res) => res.id === productsID)
    if (!product) {
        return null 
    } else {
        return product
    }
}

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
    const limit = parseInt(req.query.limit); 
    const products = readProductsFromFile();

    if (!isNaN(limit) && limit > 0) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products); 
    }
});

router.get("/api/products/:id", (req, res) => {
    const productsID = req.params.id
    const product = getProductById(productsID)
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: "Error, no se encontro ningun producto" })
    }
})

router.post("/api/products", (req, res) => {
    const products = readProductsFromFile()
    const { title, description, code, price, status, stock, category } = req.body
    if (!title ||  !description || !code || !price || status === null || !stock || !category) {
        res.status(422).json({message: "Todos los campos son requeridos"})
    }
    const newProduct = { id: products.length + 1, title: title, description: description, code: code, price: price, status: status ? status : true  , stock: stock, category: category }
    // const newProduct = req.body
    // const resultProduct = { id: products.length + 1, ...newProduct, status: true}
    products.push(newProduct)
    writeProductsFromFile(products)
    res.json({ message: "Producto agregado correctamente" })
})

router.put("/api/products/:id", (req, res) => {
    const productsID = req.params.id
    const product = getProductById(productsID)
    if (product) {
    
        res.status(404).json({ message: "Error, no se pudo actualizar el producto porque no existe" })
    } else {
        const { title, description, code, price, stock, category } = req.body
        product.title = title ? title : product.title
        product.description = description
        product.code = code
        product.price = price
        product.stock = stock
        product.category = category
        writeProductsFromFile(products)
        res.json(product)
    }
})

router.delete("/api/products/:id", (req, res) => {
    const productsID = req.params.id
    const product = getProductById(productsID)
    if (!product) {
        res.status(404).json({ message: "Error, no se pudo eliminar el producto porque no existe" })
    } else{
        const productsWithoutProductId = products.filter((product) => product.id !== productsID)
         writeProductsFromFile(productsWithoutProductId)
         res.status(200).json(productsWithoutProductId)
    }

})

module.exports = router