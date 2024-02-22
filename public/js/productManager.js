import fs from "fs"

class ProductManager {
constructor() {
    this.productsFile = 'json/productos.json';
}

async getProducts() {
    try {
    const data = await fs.promises.readFile(this.productsFile, 'utf-8');
    return JSON.parse(data);
    } catch (error) {
    return [];
    }
}

async saveProducts(products) {
    await fs.promises.writeFile(this.productsFile, JSON.stringify(products, null, 2, '\t'), 'utf-8');    
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

export default ProductManager;