import { Router } from 'express'
const router = Router()
import CartManager from '../cartManager.js'
const filePath = './entregables/carts.json'
const cartManager = new CartManager(filePath)
import ProductManager from '../productManager.js'
const productManager = new ProductManager('./entregables/products.json')
import cartsModel from '../models/cart.model.js'
import productsModel from '../models/products.model.js'


//PROYECTO FINAL

router.post('/api/carts/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    try {
        let cart = await cartManager.createCartIfNeeded(cartId);
        
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).send('Cantidad inválida');
        }
        const productIndex = cart.products.findIndex(prod => prod?.product.toString() === productId);
        console.log(productIndex)
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Endpoint para obtener y renderizar el carrito
router.get("/api/cart", async (req,res) =>{
    try {
        const cartId = await cartManager.getCartId()
        console.log("Cart ID:", cartId);
        console.log(cartId)
        res.json(cartId)
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }  
})
router.get("/api/allcarts", async (req,res) =>{
    try {
        const carts = await cartManager.getCarts()
        res.json(carts)
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).send('Error al obtener el carrito');
    }  
})
router.get('/api/cart/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await cartsModel.findOne({ _id: cartId }).lean().populate('products.product');
        if (!cart) {
            return res.render('carts', { products: [] });
        }
        const cartProducts = cart.products.map(item => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            _id: item.product._id
        }));
        res.render('carts', {products: cartProducts});
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

router.delete('/api/carts/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        let cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(prod => prod.product.toString() === productId);
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1); // Eliminar el producto del carrito
            await cart.save();
            return res.status(200).send('Producto eliminado del carrito');
        } else {
            return res.status(404).send('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
});

router.delete('/api/carts/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        let cart = await cartsModel.findById(cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        cart.products = []; // Eliminar todos los productos del carrito
        await cart.save();
        res.status(200).send('Carrito vaciado');
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).send('Error al vaciar el carrito');
    }
});


export default router;