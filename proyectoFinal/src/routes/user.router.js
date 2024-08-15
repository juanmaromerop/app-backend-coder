import { Router } from "express";
import  userModel  from "../models/products.model.js"

const router = Router()

router.get("/api/products", async (req, res) => {
    try {
        let products = await userModel.find()
        products = products.map(product => product.toJSON())
        
        res.render('products', {products})
    } catch (error) {

        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }

})

export default router