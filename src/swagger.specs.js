import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentación del Proyecto",
            description: "Documentación de los Usos la API del Proyecto CoderHouse-Curso Backend 60220"
        }
    },

    apis: ['./docs/**/**/*.yaml']
}

export const swaggerSpecs = swaggerJSDoc(options)
