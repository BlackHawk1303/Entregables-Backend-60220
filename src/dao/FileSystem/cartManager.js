import fs from "fs";

class CartManager {
    constructor() {
        this.cartsFile = 'json/carrito.json';
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.cartsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.promises.writeFile(this.cartsFile, JSON.stringify(carts, null, 2), 'utf-8');
    }
}

export default CartManager;