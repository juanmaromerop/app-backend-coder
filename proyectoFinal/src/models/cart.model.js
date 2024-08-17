import mongoose from "mongoose";

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    products: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: 'bakeryProducts',
        },
        quantity: {type: Number, default: 1},
    }
    ],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel