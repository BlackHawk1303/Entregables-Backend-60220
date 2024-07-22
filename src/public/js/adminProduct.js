const getInputValue = (input) => input.value.trim()
const isAnyEmpty = (...values) => values.some(value => value === "")

const jwt = `Bearer ${localStorage.getItem('userToken')}`

const handleProductSubmission = async (endpoint, method, product) => {
    if (!isAnyEmpty(...Object.values(product))) {
        const response = await fetch(endpoint, {
            method: method,
            body: JSON.stringify(product),
            headers: { 'Content-Type': 'application/json', 'Authorization': jwt, }
        });
        if (response.status === 200) {
            alert(method === "POST" ? "Producto Creado" : "Producto Actualizado")
        }
        else if (response.status === 401) {
            alert("No estas Autorizado para Modificar/Eliminar este Producto")
        }
        else {
            
            alert(await response.json())
        }
    } else {
        alert("Por favor, Completa Todos los Campos.")
    }
};

const selectors = [
    "txtTitleCreate", "txtDescriptionCreate", "txtPriceCreate",
    "txtStockCreate", "txtCategoryCreate", "txtThumbnailCreate",
    "btnAgregar", "txtIDUpdate", "txtTitleUpdate",
    "txtDescriptionUpdate", "txtPriceUpdate", "txtStockUpdate",
    "txtCategoryUpdate", "txtThumbnailUpdate", "btnUpdate",
    "txtIDDelete", "btnDelete"
];

const [
    txtTitleADD, txtDescriptionADD, txtPriceADD,
    txtStockADD, txtCategoryADD, txtThumbnailADD,
    btnAgregar, txtIDPUT, txtTitlePUT,
    txtDescriptionPUT, txtPricePUT, txtStockPUT,
    txtCategoryPUT, txtThumbnailPUT, btnUpdate,
    txtIDDelete, btnDelete
] = selectors.map(id => document.getElementById(id))

btnAgregar.addEventListener('click', () => {
    const product = {
        title: getInputValue(txtTitleADD),
        description: getInputValue(txtDescriptionADD),
        price: getInputValue(txtPriceADD),
        stock: getInputValue(txtStockADD),
        category: getInputValue(txtCategoryADD),
        thumbnail: getInputValue(txtThumbnailADD)
    };
    handleProductSubmission('/api/products', 'POST', product)
})

btnUpdate.addEventListener('click', () => {
    const id = getInputValue(txtIDPUT);
    
    const product = {
        title: getInputValue(txtTitlePUT),
        description: getInputValue(txtDescriptionPUT),
        price: getInputValue(txtPricePUT),
        stock: getInputValue(txtStockPUT),
        category: getInputValue(txtCategoryPUT),
        thumbnail: getInputValue(txtThumbnailPUT)
    };
    handleProductSubmission(`/api/products/${id}`, 'PUT', product);
})

btnDelete.addEventListener('click', async () => {
    const id = getInputValue(txtIDDelete);
    if (!isAnyEmpty(id)) {
        const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json', 'Authorization': jwt, }
        });
        if (response.status === 200) {
            alert("Producto Eliminado");
        }
        else if (response.status === 401) {
            alert("No estas Autorizado para Modificar/Eliminar este Producto")
        }
        else {
            
            alert(await response.json())
        }
    } else {
        alert("Por Favor, Proporciona un ID Válido.")
    }
})