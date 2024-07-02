import { productsModel } from "../dao/db/models/products.model.js";
export default class ProdServices {
    constructor() { }

    getAllProducts = async () => {
        let products = await productsModel.find()
        return products.map(prod => prod.toObject())
    }

    saveProducts = async (product) => {
        let status = await productsModel.create(product)
        return status
    }

    getProductsById = async (ID) => {
        let product = await productsModel.find(ID)
        return product
    }

    deleteProduct = async (ID) => {
        let status = await productsModel.deleteOne(ID)
        return status
    }

    updateProducts = async (newData, ID) => {
        let productUpdated = productsModel.updateOne(ID, newData)
        return productUpdated
    }

    getProducts = async (page, limit, find, url, ord) => {
        const query = {};
        if (find) {
            query.category = capitalizeFirstLetter(find);
        }
        
        if (!page) page = 1
        if (!limit) limit = 10

        const sort = ord === "asc" ? { "price": 1 } : (ord === "desc" ? { "price": -1 } : "");
        const options = { page, limit, lean: true };
        if (ord) {
            options.sort = sort;
        }
    
        const item = await productsModel.paginate(query, options);
        const prevLink = item.hasPrevPage ? `http://localhost:8080/products?page=${item.prevPage}` : '';
        const nextLink = item.hasNextPage ? `http://localhost:8080/products?page=${item.nextPage}` : '';
        const isValid = !(page < 1 || page > item.totalPages);
        const status = isValid ? "Success" : "Error";        
        
        return {
            valid: isValid,
            status: status,
            payload: item.docs,
            totalPages: item.totalPages,
            prevPage: item.prevPage,
            nextPage: item.nextPage,
            page: page,
            hasPrevPage: item.hasPrevPage,
            hasNextPage: item.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };
    }

}
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}





