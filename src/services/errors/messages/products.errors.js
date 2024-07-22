// export const generateFieldError = (field, expectedType, receivedValue) => {
//     return `-- ${field}: Se Esperaba un <${expectedType}> y se Recibió => "${receivedValue}"`;
// };

// export const createProdError = (prod) => {
//     const fields = [
//         { field: 'Título', expectedType: 'String', value: prod.title },
//         { field: 'Descripción', expectedType: 'String', value: prod.description },
//         { field: 'Precio', expectedType: 'Number', value: prod.price },
//         { field: 'Stock', expectedType: 'Number', value: prod.stock },
//         { field: 'Categoría', expectedType: 'String', value: prod.category },
//         { field: 'thumbnail', expectedType: 'String', value: prod.thumbnail }
//     ];

//     const errors = fields.map(f => generateFieldError(f.field, f.expectedType, f.value));
//     return `La información que estás tratando de ingresar no es válida. Por favor, revisa esta información:\n${errors.join('\n')}\n`;
// };

// export const deleteProdError = (pid) => {
//     return `La información que estás tratando de ingresar no es válida:\n-- El ID del producto "${pid}" no es válido, por favor revisa.`;
// };

export const createProdError = (prod) => {
    return `La Información Proporcionada para Crear el Producto es Inválida o está Incompleta. Por Favor, Verifica los Datos Ingresados:

    -- Título: Se esperaba una cadena de texto (String) y se recibió => "${prod.title}"
    -- Descripción: Se esperaba una cadena de texto (String) y se recibió => "${prod.description}"
    -- Precio: Se esperaba un número (Number) y se recibió => "${prod.price}"
    -- Stock: Se esperaba un número (Number) y se recibió => "${prod.stock}"
    -- Categoría: Se esperaba una cadena de texto (String) y se recibió => "${prod.category}"
    -- Miniatura (thumbnail): Se esperaba una cadena de texto (String) y se recibió => "${prod.thumbnail}"
    `;
};

export const deleteProdError = (pid) => {
    return `El ID del Producto Proporcionado es Inválido o no Existe. Por Favor, Verifica y Vuelve a Intentarlo:
    -- ID del Producto: ${pid}
    `;
};