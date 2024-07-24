import { Router } from 'express'
const router = Router()
import CartManager from '../cartManager.js'
const filePath = './entregables/carts.json'
const cartManager = new CartManager(filePath)
import ProductManager from '../productManager.js'
const productManager = new ProductManager('./entregables/products.json')

router.post("/api/cart", async (req, res) => {
    res.json(await cartManager.createCart())
})

router.get("/api/cart/:cid", async (req, res) => {
    const cartID = parseInt(req.params.cid)
    const response = await cartManager.getCartById(cartID);

    if (response.error) {
        res.status(404).json(response)
    } else {
        res.json(response)
    }
})

router.post("/api/cart/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        const findProduct = await productManager.getProductById(productId)
        const findCart = await cartManager.getCartById(cartId)

        if (findProduct.message || findCart.error) {
            res.status(404).json({ message: `Error, el id del producto o del carrito no son existentes` })
        } else {
            await cartManager.createProductInCart(cartId, findProduct)
            res.json({ message: `El producto con id ${productId} fue agregado correctamente al carrito con id ${cartId}` })
        }
    } catch (error) {
        res.status(500).json({ error: err.message })
    }
})

export default router