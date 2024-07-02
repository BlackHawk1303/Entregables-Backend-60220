import { expect } from "chai"
import supertest from "supertest"

import { faker } from '@faker-js/faker'

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJKb3NlIFZpZGFsIiwiZW1haWwiOiJqb3ZAZ21haWwuY29tIiwiYWdlIjozMywicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxODUxMTUxNiwiZXhwIjoxNzUwMDQ3NTE2fQ.22v-Nc3eAEEvkzfCi0AOnMYY741GeVOirXWPgcjtCrY" //1 Año Duración
const TOKEN_USER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJEb21pbmdvIFNlZ3VuZG8iLCJlbWFpbCI6ImRvbWlAZ21haWwuY29tIiwiYWdlIjozMywicm9sZSI6InByZW1pdW0ifSwiaWF0IjoxNzE4NTk0MzA2LCJleHAiOjE3NTAxMzAzMDZ9.3QeFPYJudWjr-7RXDRM6qryIP91yOdGv8gOqvORI0LE"
const expects = expect
const request = supertest("http://localhost:8080")


// [TEST Producto]
describe("Test products API", () => {
    // [[ Creación de un Producto ]]
    describe("Testing products POST API", () => {
        it("Crear Producto en el Método POST de /api/products, Se Debe Crear Correctamente", async () => {
            const prodMock = {
                // title: "Producto Creado en Testing",
                // description: "Descripción del Producto",
                // code: "123",
                // price: 11495,
                // stock: 55,
                // category: "pruebas",
                // thumbnail: "img/pruebas"
                title: "Producto Creado en Testing",
                description: "Descripción del Producto",
                code: "101010",
                price: 20000,
                stock: 210,
                category: "Esto es una Prueba",
                thumbnail: "img/pruebas"
            }
            const result = await request.post("/api/products")
                .send(prodMock)
                .set('Authorization', `Bearer ${TOKEN}`)
            //expects(result.status).to.equal(201)
            expects(result.status).to.equal(200)
            expects(result.body).to.have.property('_id')
            expects(result.body.title).to.equal(prodMock.title)
        })
        // [[ Obtener un Producto por ID ]]
        it("Obtener Producto por ID desde el Método GET de /api/products/:id", async () => {
            const prodId = "666e68ddd354625718cef703" //Cambiar Según el ID por un Producto Existente
            const result = await request.get(`/api/products/${prodId}`)
                .set('Authorization', `Bearer ${TOKEN}`)
            expects(result.status).to.equal(200)
            expects(result.body[0]).to.have.property('_id')
            expects(result.body[0]).to.have.property('title')
        })
        // [[ Actualización de un Producto ]]
        it("Actualizar Producto en el Método PUT de /api/products/:id, Se Debe Actualizar Correctamente", async () => {
            const prodId = "666e68ddd354625718cef703" //Cambiar Según el ID por un Producto Existente
            const updateMock = {
                title: "Producto Actualizado en Testing",
                description: "Descripción Actualizada del Producto",
                price: "666669",
                stock:"1000",
                category:"Categoría Actualizada del Producto",
                thumbnail:"Thumbnail Actualizado del Producto",
            }
            const result = await request.put(`/api/products/${prodId}`)
                .send(updateMock)
                .set('Authorization', `Bearer ${TOKEN}`)
            
            expects(result.status).to.equal(200)
            // expects(result.body[0]).to.have.property('id', prodId)
            //expects(result.body[0].title).to.equal(updateMock.title)
            expects(result.body).to.have.property("response")
        })

        // [[ Eliminación de un Producto ]]
        // it("Eliminar Producto en el Método DELETE de /api/products/:id, Se Debe Eliminar Correctamente", async () => {
        //     const prodId = "65ee636c00c84c1479740a11" //Cambiar Según el ID por un Producto Existente

        //     const result = await request.delete(`/api/products/${prodId}`)
        //         .set('Authorization', `Bearer ${TOKEN}`)
        //     expects(result.status).to.equal(204)
        // })
    })
})
// [TEST Producto]

// [TEST Carrito]
describe("Test cart API", () => {

    // [[ Añadir un Producto al Carrito ]]
    describe("Testing cart POST API", () => {
        it("Añadir un Producto al Carrito en el Método POST de /api/cart, Se debe Añadir Correctamente", async () => {
            // const cartMock = {
            //     productId: "65ee636c00c84c1479740a11", //Cambiar Según el ID por un Producto Existente
            //     cartId: "65f7b2e62aae497193d15d61", //Cambiar Según el ID por un Carrito Existente
            //     quantity: 2
            // }

            const productId= "666e68ddd354625718cef703" //Cambiar Según el ID por un Producto Existente
            const cartId= "65f7b2e62aae497193d15d61" //Cambiar Según el ID por un Carrito Existente
            const result = await request.post(`/api/carts/${cartId}/products/${productId}`)
                // .send(cartMock)
                .set('Authorization', `Bearer ${TOKEN_USER}`)
            expects(result.status).to.equal(200)
            expects(result.body).to.have.property('status')
            // expects(result.body.products).to.include(cartMock)
        })
        // [[ Obtener el carrito por ID ]]
        it("Obtener carrito por ID desde el método GET de /api/cart/:id", async () => {
            const cartId = "65f7b04835d268b6d25690a0" //Cambiar Según el ID por un Carrito Existente

            const result = await request.get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${TOKEN_USER}`)
            expects(result.status).to.equal(200)
            expects(result.body[0]).to.have.property('_id', cartId)
            expects(result.body[0]).to.have.property('products')
        })
        // [[ Actualización de un Carrito ]]
        it("Actualizar el carrito en el método PUT de /api/cart/:id, Se Debe Actualizar Correctamente", async () => {
            const cartId = "65f7b04835d268b6d25690a0" //Cambiar Según el ID por un Carrito Existente
            const productId= "666e68ddd354625718cef703"
            // const updateMock = {
            //     products: [
            //         { productId: 1, quantity: 3 },
            //         { productId: 2, quantity: 1 } //Cambiar Según el ID por un Producto Existente
            //     ]
            // }
            const result = await request.put(`/api/carts/${cartId}/products/${productId}`)
                // .send(updateMock)
                .set('Authorization', `Bearer ${TOKEN_USER}`)
            expects(result.status).to.equal(200)
            expects(result.body).to.have.property('status')
            expects(result.body.status).to.be.deep.equal("Cantidad Actualizada")
        })
        // [[ Eliminar un Producto del Carrito ]]
        // it("Eliminar un Producto del Carrito en el Método DELETE de /api/cart/:id/products/:productId, Debe Eliminar Correctamente", async () => {
        //     const cartId =  "65f7b04835d268b6d25690a0" //Cambiar Según el ID por un Carrito Existente
        //     const productId = "65ee636c00c84c1479740a11" //Cambiar Según el ID por un Producto Existente

        //     const result = await request.delete(`/api/cart/${cartId}/products/${productId}`)
        //         .set('Authorization', `Bearer ${TOKEN_USER}`)

        //     expects(result.status).to.equal(204)
        // })

        // [[ Vaciar el Carrito ]]
        // it("Vaciar el Carrito en el Método DELETE de /api/cart/:id, Debe Vaciar Correctamente", async () => {
        //     const cartId = "65f7b04835d268b6d25690a0" //Cambiar Según el ID por un Carrito Existente
        //     const result = await request.delete(`/api/carts/${cartId}`)
        //         .set('Authorization', `Bearer ${TOKEN}`)
        //     expects(result.status).to.equal(204)
        //     const checkResult = await request.get(`/api/cart/${cartId}`)
        //         .set('Authorization', `Bearer ${TOKEN}`)
        //     expects(checkResult.status).to.equal(200)
        //     expects(checkResult.body.products).to.be.an('array').that.is.empty
        // })
    })
})
// [TEST Carrito]

// [TEST Session]
describe("Test user API", () => {
    // [[ Prueba de Registro de Usuario ]]

    let newEmail = faker.internet.email()

    it("Registrar un Nuevo Usuario en el Método POST de /user/register, Se Debe Registrar Correctamente", async () => {
        const userMock = {
            first_name: "Test",
            last_name: "User",
            email: newEmail,
            password: "newpasswordtest",
            age: 57
        }
        const result = await request.post("/user/register")
            .send(userMock)

        expect(result.status).to.equal(201)
        expect(result.body).to.have.property('status', 'success')
        expect(result.body).to.have.property('message', 'Usuario Creado Exitosamente')
    })
    // [[ Prueba de inicio de sesión de usuario ]]
    it("Iniciar Ssesión con un Usuario en el Método POST de /user/login, Se debe Autenticar Correctamente", async () => {
        const loginMock = {
            email: newEmail,
            password: "newpasswordtest"
        }
        const result = await request.post("/user/login")
            .send(loginMock)

        expect(result.status).to.equal(200)
        expect(result.body).to.have.property('message', 'Inicio de Sesión Satisfactorio')
        expect(result.body).to.have.property("token").and.not.to.be.empty
        expect(result.body).to.have.property("id").and.not.to.be.empty
        // expect(result.body).to.have.property('message', 'Usuario Autenticado Exitosamente')
        
    })
    // [[ Prueba de Obtener Información del Usuario Actual ]]
    it("Obtener Información del Usuario Actual en el Método GET de /user/current/:userId", async () => {
        const userId = "663865b61868baca07d8a70a" //Cambiar Según el ID por un Usuario Existente

        const result = await request.get(`/user/current/${userId}`)
            .set('Authorization', `Bearer ${TOKEN_USER}`)
        expect(result.status).to.equal(200)
        expect(result.body).to.have.property('name').and.not.to.be.empty
        expect(result.body).to.have.property('email').and.not.to.be.empty
        expect(result.body).to.have.property('role').and.not.to.be.empty
    })

    // [[ Prueba de error en el registro de usuario ]]
    it("Registrar un Nuevo Usuario con Datos Incorrectos en el Método POST de /user/register, Debe Retornar un Error", async () => {
        const invalidUserMock = {
            first_name: "Test",
            email: "wrong@wrong.com",
            password: "short",
        }        

        const result = await request.post("/user/register")
            .send(invalidUserMock)        
        expect(result.status).to.equal(500)
        expect(result).to.have.property('error')
    })

    // [[ Prueba de Error en el Inicio de Sesión ]]
    it("Iniciar Sesión con un Usuario con Datos Incorrectos en el Método POST de /user/login, Debe Retornar un Error", async () => {
        const invalidLoginMock = {
            email: "noexiste@blablabla.com",
            password: "blablabla-wrongpassword-blablabla"
        }
        const result = await request.post("/user/login")
            .send(invalidLoginMock)
        expect(result.status).to.equal(404)
        expect(result.body).to.have.property('error').and.to.be.equal("Usuario no Encontrado")
    })
})
// [TEST Session]