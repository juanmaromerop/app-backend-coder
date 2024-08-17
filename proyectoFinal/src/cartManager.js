import { promises as fs } from 'fs';
import cartsModel from './models/cart.model.js';
import mongoose from 'mongoose';



class CartManager {
    constructor(file) {
        this.file = file
    }

  
    createCartIfNeeded = async (cartId) => {
        // Validar si el cartId es un ObjectId válido de Mongoose
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            console.log("El ID proporcionado no es válido, creando un nuevo carrito.");
            const cart = await cartsModel.create({});
            return cart
        } 

        // Buscar el carrito por el ID proporcionado
        const existingCart = await cartsModel.findOne({ _id: cartId });

        if (!existingCart) {
            console.log("No se encontró el carrito, creando uno nuevo.");
            return await cartsModel.create({});
        }

        return existingCart;
    };
    
   getCart =  async () => {
        try {
            const lastCart = await this.cartCollection
                .findOne({}, { _id: 1 }) // Selecciona solo el campo _id
                .sort({ _id: -1 }) // Ordena por _id de manera descendente para obtener el último creado
                .lean();
            return lastCart ? lastCart._id : null; // Devuelve el _id o null si no hay resultados
        }
        catch (err) {
            return { error: err.message };
        }
    }

}




export default CartManager
