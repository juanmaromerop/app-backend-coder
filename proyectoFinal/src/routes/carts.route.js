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

router.post('/api/carts/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    console.log(cartId);
    
    try {
        let cart = await cartManager.createCartIfNeeded(cartId);
        
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
router.get('/api/carts/:cartId', async (req, res) => {
    const { cartId } = req.params;
   
    

    try {
        const cart = await cartsModel.findOne({ cartId }).populate('products.productId');
        console.log(cart);
        
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
router.get("/api/carts", async (req,res) =>{
    try {
        const cartId = await cartManager.getCart()
        res.json(cartId)
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
    
})
// // Endpoint para eliminar un producto del carrito
// router.delete('/api/carts/:userId/products/:productId', async (req, res) => {
//     const { userId, productId } = req.params;

//     try {
//         let cart = await cartsModel.findOne({ userId });
//         cart.products = cart.products.filter(p => p.productId.toString() !== productId);
//         await cart.save();

//         res.status(200).send('Producto eliminado del carrito');
//     } catch (error) {
//         console.error('Error al eliminar el producto del carrito:', error);
//         res.status(500).send('Error al eliminar el producto del carrito');
//     }
// });

// // Endpoint para vaciar el carrito
// router.delete('/api/carts/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         let cart = await cartsModel.findOne({ userId });
//         cart.products = [];
//         await cart.save();

//         res.status(200).send('Carrito vaciado');
//     } catch (error) {
//         console.error('Error al vaciar el carrito:', error);
//         res.status(500).send('Error al vaciar el carrito');
//     }
// });



export default router;