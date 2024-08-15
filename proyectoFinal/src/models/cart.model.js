import mongoose from "mongoose";

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    userId: String,
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'bakeryProducts' },
        quantity: Number,
    }],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel