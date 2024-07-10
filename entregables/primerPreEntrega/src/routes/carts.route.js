const express = require('express')
const router = express.Router()
const fs = require('fs')

const fileCartsPath = 'carts.json'

// const readCartsFromFile = () =>{
//     try {
//         const data = fs.readFileSync(fileCartsPath, "utf-8")
//         return JSON.parse(data)
//     } catch (error) {
//         return []
//     }
// }

// const writeCartsFromFile = (carts) =>{
//     fs.writeFileSync(fileCartsPath, JSON.stringify(carts, null, 2))
// }

// router.get("/api/carts", (req, res) =>{
//     const carts = readCartsFromFile()
//     res.json(carts)
// })

// router.post("/api/carts", (req, res) =>{
//     const carts = readCartsFromFile()
//     const { title, description, code, price, status, stock, category } = req.body
//     const newCart = {id: carts.lenght + 1, title:title, description: description, code: code, price: price, status: status, stock: stock, category: category }
//     carts.push(newCart)
//     writeCartsFromFile(carts)
//     res.json({messge: "Cart agregada correctamente"})

// })




// const productsFilePath = 'products.json'
const filePath = 'carts.json'

// const readProductsFromFile = () => {
//     try {
//         const data = fs.readFileSync(productsFilePath, "utf-8")
//         return JSON.parse(data)
//     } catch (error) {
//         return []
//     }
// }

const readCartsFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const writeCartsFromFile = (carts) => {
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2))
}


router.get("/api/carts", (req, res) => {
    const carts = readCartsFromFile()
    res.json(carts)
})

router.post("/api/carts", (req, res) => {
    // const products = readProductsFromFile()
    const carts = readCartsFromFile()
    const { title, description, code, price, status, stock, category } = req.body
    const newCart = { id: carts.length + 1, title: title, description: description, code: code, price: price, status: status, stock: stock, category: category}
    carts.push(newCart)
    writeCartsFromFile(carts)
    res.json({ message: "Cart fue agregado correctamente" })
})

module.exports = router