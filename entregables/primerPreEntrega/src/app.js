const express = require('express')
const path = require('path')
const productsRouter = require('./routes/products.route.js')
const cartsRouter = require('./routes/carts.route.js')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(express.static(path.join(__dirname, "public")))
// app.get("/", (req, res) =>{
//     res.sendFile(path.join(__dirname, "public", "index.html"))
// } )

app.use("/", productsRouter)
app.use("/", cartsRouter)


app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
})
