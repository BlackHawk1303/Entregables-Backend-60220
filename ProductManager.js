const fs = require('fs').promises;

class ProductManager {
constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
}

async loadProducts() {
    try {
    const data = await fs.readFile(this.path, 'utf8');
    this.products = JSON.parse(data) || [];
    } catch (error) {
      //Si hay un error al leer el archivo o al parsear el JSON, retorna un array vacío.
    this.products = [];
    }
}

async saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.path, data, 'utf8');
}

addProduct(product) {
    product.id = this.generateId();
    this.products.push(product);
    this.saveProducts();
}

getProducts() {
    return this.products;
}

async getProductById(productId) {
    await this.loadProducts();
    return this.products.find(product => product.id === productId);
}

async updateProduct(productId, updatedFields) {
    const index = this.products.findIndex(product => product.id === productId);
    if (index !== -1) {
    this.products[index] = { ...this.products[index], ...updatedFields };
    await this.saveProducts();
    return true;
    }
    return false;
}
async deleteProduct(productId) {

    const data = await fs.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);

    let actual = this.products
    this.products = this.products.filter(product => product.id !== productId);
    if (actual.length !== this.products.length){
        await this.saveProducts(); 
        return true
    } 
    else return false

    
}

generateId() {
    return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
}
}

//Uso de la clase ProductManager
const productManager = new ProductManager('productos.json');

//Agregar un producto
productManager.addProduct({
title: 'Producto 1',
description: 'Lorem ipsum',
price: 20.000,
thumbnail: 'www.loremipsum.com',
code: 'ABC123',
stock: 30
});

productManager.addProduct({
    title: 'Producto 2',
    description: 'Lorem',
    price: 90.000,
    thumbnail: 'www.loremipsum.com',
    code: '222',
    stock: 301
    });

    productManager.addProduct({
        title: 'Producto 3',
        description: 'Lorem',
        price: 90.000,
        thumbnail: 'www.loremipsum.com',
        code: '222',
        stock: 301
        });
    
//Consultar productos
const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

//Consultar un producto por ID
const productIdToFind = 1;
productManager.getProductById(productIdToFind).then(foundProduct => console.log(`Producto con ID ${productIdToFind}:`, foundProduct));

//Modificar un producto
const productIdToUpdate = 1;
const updatedProductData = { price: 25.000, stock: 70 };
productManager.updateProduct(productIdToUpdate, updatedProductData).then(isUpdated => console.log('Producto Actualizado:', isUpdated ? 'Éxito' : 'No se encontró el Producto'));

//Eliminar un producto
const productIdToDelete = 1;
// // productManager.deleteProduct(productIdToDelete).then(() => console.log('Producto Eliminado con ID:', productIdToDelete));
productManager.deleteProduct(productIdToDelete).then(isDeleted => console.log('Producto Eliminado:',isDeleted?' Correctamente': 'id no encontrado'))

//Verificar los productos después de la eliminación
const remainingProducts = productManager.getProducts();
console.log('Productos Restantes:', remainingProducts);