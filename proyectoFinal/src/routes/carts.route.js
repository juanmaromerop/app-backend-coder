import { Router } from 'express'
const router = Router()
import CartManager from '../cartManager.js'
const filePath = './entregables/carts.json'
const cartManager = new CartManager(filePath)
import ProductManager from '../productManager.js'
const productManager = new ProductManager('./entregables/products.json')
import cartsModel from '../models/cart.model.js'
import productsModel from '../models/products.model.js'

// router.post("/api/cart", async (req, res) => {
//     res.json(await cartManager.createCart())
// })

// router.get("/api/cart/:cid", async (req, res) => {
//     const cartID = parseInt(req.params.cid)
//     const response = await cartManager.getCartById(cartID);

//     if (response.error) {
//         res.status(404).json(response)
//     } else {
//         res.json(response)
//     }
// })

// router.post("/api/cart/:cid/product/:pid", async (req, res) => {
//     try {
//         const cartId = parseInt(req.params.cid)
//         const productId = parseInt(req.params.pid)
//         const findProduct = await productManager.getProductById(productId)
//         const findCart = await cartManager.getCartById(cartId)

//         if (findProduct.message || findCart.error) {
//             res.status(404).json({ message: `Error, el id del producto o del carrito no son existentes` })
//         } else {
//             await cartManager.createProductInCart(cartId, findProduct)
//             res.json({ message: `El producto con id ${productId} fue agregado correctamente al carrito con id ${cartId}` })
//         }
//     } catch (error) {
//         res.status(500).json({ error: err.message })
//     }
// })

//PROYECTO FINAL

router.post('/api/carts/:userId/products/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    try {
        let cart = await cartManager.createCartIfNeeded(userId);

        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).send('Cantidad inválida');
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Endpoint para obtener y renderizar el carrito
router.get('/api/carts/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await cartsModel.findOne({ userId }).populate('products.productId');

        if (!cart) {
            return res.render('carts', { products: [] });
        }

        const cartProducts = cart.products.map(item => ({
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            _id: item.productId._id
        }));

        res.render('carts', {
            products: cartProducts
        });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});




export default router;