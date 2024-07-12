const { error } = require('console');

const fs = require('fs').promises;

class CartManager {
    constructor(file) {
        this.file = file
    }

    readCartsFromFile = async () => {
        try {
            const data = await fs.readFile(this.file, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    writeCartsFromFile = async (carts) => {
        await fs.writeFile(this.file, JSON.stringify(carts, null, 2))
    }

    incrementableId = async () => {
        let idMax = 0
        const dataParse = await this.readCartsFromFile();
        dataParse.forEach(cart => {
            if (cart.id > idMax) {
                idMax = cart.id
            }
        });
        return idMax + 1
    }

    createCart = async () => {
        const carts = await this.readCartsFromFile()
        const newCart = { id: await this.incrementableId(), products: [] }
        carts.push(newCart)
        await this.writeCartsFromFile(carts)
        return { message: "Carrito creado" }
    }

    getCartById = async (cid) => {
        const carts = await this.readCartsFromFile()
        const cart = carts.find((cart) => cart.id === cid)
        if (!cart) {
            return {error: `Error, no se encontro el carrito con el id ${cid}`}
        }
        return cart
    }
}




module.exports = CartManager
