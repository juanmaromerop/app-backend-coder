import { Router } from 'express'
const router = Router()
import ProductManager from '../productManager.js'
const filePath = './entregables/products.json'
const productManager = new ProductManager(filePath)
import productsModel from "../models/products.model.js"

// router.get("/api/products", async (req, res) => {
//     const limit = parseInt(req.query.limit);
//     res.json(await productManager.getProducts(limit))
// });

// router.get("/api/products/:id", async (req, res) => {
//     const productsID = req.params.id
//     const productResponse = await productManager.getProductById(productsID)

//     if (!productResponse) {
//         res.status(404).json(productResponse)
//     } else {
//         res.json(productResponse)
//     }
// })

// router.post("/api/products", async (req, res) => {
//     const { title, description, code, price, status, stock, category } = req.body
//     res.json(await productManager.createProduct(title, description, code, price, status, stock, category))
// })

// router.put("/api/products/:id", async (req, res) => {
//     const productsID = req.params.id
//     const { title, description, code, price, status, stock, category } = req.body
//     res.json(await productManager.updateProductById(title, description, code, price, status, stock, category, productsID))
// })

// router.delete("/api/products/:id", async (req, res) => {
//     const productsID = req.params.id
//     res.json(await productManager.deleteProductById(productsID))
// })



//PROYECTO FINAL

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