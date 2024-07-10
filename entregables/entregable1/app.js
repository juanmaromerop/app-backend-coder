const fs = require('fs')
const { title } = require('process')

class ProductManager {
    constructor(filePath) {
        this.path = filePath
        this.initializeFile()
        this.nextId = this.getNextId() // Inicializa el ID basandose en los productos
    }

    //Inicializacion del archivo
    initializeFile() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]))
        }
    }


    //Funcion Incrementar ID
    getNextId() {
        const products = this.getProductsFromFile
        if (products.length === 0) {
            return 1
        }
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0)
        return maxId + 1
    }
    //Metedo para agregar productos
    addProduct(product) {
        const products = this.getProductsFromFile()
        product.id = this.nextId
        this.nextId += 1

        products.push(product)
        this.saveProductsToFile(products)
    }

    // Metedo que devuelva todos los productos
    getProducts() {
        return this.getProductsFromFile()
    }

    //Metedo que devuelva solo un productos por ID
    getProduct(id) {
        const products = this.getProductsFromFile()
        return products.find(product => product.id === id)
    }

    //Metodo para Actualizar  un producto
    updateProduct(id, updatedFields) {
        const products = this.getProductsFromFile()
        const index = products.findIndex(product => product.id === id)
        if (index !== -1) {
            products[index] = { ...products[index], updatedFields }
            this.saveProductsToFile(products)
        }
    }

    //Metedo para eliminar  un producto por ID
    deleteProduct(id) {
        let products = this.getProductsFromFile()
        products = products.filter(product => product.id !== id)
        this.saveProductsToFile(products)
    }

    //Metedo para leer el archivo y que devuelva los productos
    getProductsFromFile() {
        const data = fs.readFileSync(this.path, "utf-8")
        return JSON.parse(data)
    }
    //Metedo para guardar los productos en un archivo
    saveProductsToFile(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
    }
}

const manager = new ProductManager('products.json')

//Añadir un producto
manager.addProduct({
    title: "Producto A",
    description: "Descripcion del producto A",
    price: 100,
    code: "abc121",
    stock: 10
}
)
// manager.addProduct({
//     title: "Producto B",
//     description: "Descripcion del producto B",
//     price: 100,
//     code: "abc1215",
//     stock: 10
// }
// )
// manager.addProduct({
//     title: "Producto C",
//     description: "Descripcion del producto C",
//     price: 100,
//     code: "abc1214",
//     stock: 10
// }
// )

//Obtener todos los productos
const allProducts = manager.getProducts()
console.log(allProducts);

//Borrar un archivo
manager.deleteProduct(1)

//Actualizar un archivo
manager.updateProduct(2, {price:9525, stock: 1, code:"juan"})
