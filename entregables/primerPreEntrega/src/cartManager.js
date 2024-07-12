const fs = require('fs').promises;

class CartManager {
    constructor(file) {
        this.file = file
    }

    readCartsFromFile = async () => {
        try {
            const data = await fs.readFileSync(filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    writeCartsFromFile = async (carts) => {
     await  fs.writeFileSync(filePath, JSON.stringify(carts, null, 2))
    }
}

module.exports = CartManager
