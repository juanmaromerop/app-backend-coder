import { Router } from 'express'
const router = Router()
import ProductManager from '../productManager.js'
const filePath = './entregables/products.json'
const productManager = new ProductManager(filePath)
import productsModel from "../models/products.model.js"

//PROYECTO FINAL
router.post("/api/products", async (req, res) => {
    const { name, description, price, quantity, category } = req.body;
    const validCategories = ['bolleria', 'galletas', 'panes', 'pasteles'];

    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Categoría no válida' });
    }

    try {
        const newProduct = new productsModel({
            name,
            description,
            price,
            quantity,
            category
        });

        await newProduct.save();
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.get("/api/products", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category || 'todos';
        const sort = req.query.sort || 'default'


        const query = category !== 'todos' ? { category } : {};
        let sortOptions = {}
        if (sort === 'asc') {
            sortOptions = { price: 1 }
        } else if (sort === 'desc') {
            sortOptions = { price: -1 }
        } else {
            sortOptions = {}
        }
        const options = {
            page,
            limit,
            sort: sortOptions
        };

        let products = await productsModel.paginate(query, options);
        const productDocs = products.docs.map(product => product.toJSON());

        const categories = await productsModel.distinct("category")

        res.render('products', {
            products: productDocs,
            categories: ['todos', ...categories.map(cat => cat.toLocaleLowerCase())],
            selectedCategory: category,
            totalDocs: products.totalDocs,
            totalPages: products.totalPages,
            pagingCounter: page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            limit,

        });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
});

export default router