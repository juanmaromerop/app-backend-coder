const fs = require('fs').promises

class ProductManager {
    constructor(file) {
        this.file = file;
    }

   readProductsFromFile = async  () => {
        try {
            const data =  await fs.readFileSync(this.file, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return []
        }
    }
    
    writeProductsFromFile = async (products) => {
        await fs.writeFileSync(this.file, JSON.stringify(products, null, 2));
    }
    
    getProducts = async (limit) => {
        const products = await this.readProductsFromFile();
        if (!isNaN(limit) && limit > 0) {
            return products.slice(0, limit);
        } else {
            return products;
        }
    }

    incrementableId = async () => {
        let idMax = 0
        const dataParse = await this.getProducts();
        dataParse.forEach(product => {
            if (product.id > idMax) {
                idMax = product.id
            }
        });
        return idMax + 1
    }

    getProductById = async (pid) => {
        const products = await this.readProductsFromFile()
        const productsID = parseInt(pid)
        const product = products.find((product) => product.id === productsID)
        if (!product) {
            return { message: "Error, no se encontro ningun producto" }
        } else {
            return product
        }
    }

    createProduct = async (title, description, code, price, status, stock, category) => {
        const products = await this.readProductsFromFile()
        if ([title, description, code, price, stock, category].some(param => param === undefined)) {
            return { message: "Todos los campos son requeridos" };
        }
        const newProduct =
        {
            id: this.incrementableId(),
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category
        }
        products.push(newProduct)
      await  this.writeProductsFromFile(products)
        return { message: "Producto agregado correctamente" }
    }


    updateProductById = async (title, description, code, price, status, stock, category, pid) => {
        const products = await this.readProductsFromFile();
        const productIndex = products.findIndex((product) => product.id === parseInt(pid));

        if (productIndex === -1) {
            return { message: 'Error, no se pudo actualizar el producto porque no existe' };
        } else {
            const product = products[productIndex];
            product.title = title || product.title;
            product.description = description || product.description;
            product.code = code || product.code;
            product.price = price || product.price;
            product.status = status !== undefined ? status : product.status;
            product.stock = stock || product.stock;
            product.category = category || product.category;

            await this.writeProductsFromFile(products);
            return { message: 'Producto actualizado correctamente', product };
        }

};

deleteProductById = async (pid) => {
    const products = await this.readProductsFromFile()
    const product = await this.getProductById(pid)
    if (!product) {
        return { message: "Error, no se pudo eliminar el producto porque no existe" }
    } else {
        const productsWithoutProductId = products.filter((product) => product.id !== parseInt(pid))
         await this.writeProductsFromFile(productsWithoutProductId)
        return productsWithoutProductId
    }
}

}

module.exports = ProductManager