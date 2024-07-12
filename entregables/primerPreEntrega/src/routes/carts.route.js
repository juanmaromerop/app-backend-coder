const express = require('express')
const router = express.Router()
const fs = require('fs')
const CartManager = require('../cartManager.js')
const filePath = './entregables/carts.json'
const cartManager = new CartManager(filePath)



const readCartsFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const writeCartsFromFile = (carts) => {
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2))
}


router.get("/api/carts", (req, res) => {
    const carts = readCartsFromFile()
    res.json(carts)
})

router.get("/:cid", (req, res) =>{
    const carts = readCartsFromFile()
    const cartsID = parseInt(req.params.cid)
    const cart = carts.find((res) => res.id === cartsID)
    res.status(200).json(cart)
}) 

router.post("/api/carts", (req, res) => {
    const carts = readCartsFromFile()
    const { title, description, code, price, status, stock, category } = req.body
    const newCart = { id: carts.length + 1, title: title, description: description, code: code, price: price, status: status, stock: stock, category: category}
    carts.push(newCart)
    writeCartsFromFile(carts)
    res.json({ message: "Cart fue agregado correctamente" })
})

module.exports = router