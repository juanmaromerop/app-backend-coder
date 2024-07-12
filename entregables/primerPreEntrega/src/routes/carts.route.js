const express = require('express')
const router = express.Router()
const CartManager = require('../cartManager.js')
const filePath = './entregables/carts.json'
const cartManager = new CartManager(filePath)

router.post("/api/cart", async (req, res) => {
    res.json(await cartManager.createCart())
})

router.get("/api/cart/:cid", async (req, res) =>{
    const cartID = parseInt(req.params.cid)
    const response = await cartManager.getCartById(cartID);
    if (response.error) {
        res.status(404).json(response)
    } else {
        res.json(response)
    }
}) 

module.exports = router