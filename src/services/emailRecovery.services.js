import emailRecovery from "../dao/db/models/emailRecovery.js"

class EmailRecoveryProvider {
    constructor() { }

    async createRecovery(data) {
        try {
            const status = await emailRecovery.create(data)
            return status
        } catch (error) {
            console.error("Error al Crear la Recuperación de Email:", error)
            throw new Error("Error al Crear la Recuperación de Email")
        }
    }

    async deleteRecovery(id) {
        try {
            const status = await emailRecovery.deleteOne({ _id: id })
            return status
        } catch (error) {
            console.error("Error al Eliminar la Recuperación de Email:", error)
            throw new Error("Error al Eliminar la Recuperación de Email")
        }
    }

    async findOne(uuid) {
        try {
            const status = await emailRecovery.findOne({ recoverID: uuid })
            return status
        } catch (error) {
            console.error("Error al Buscar la Recuperación de Email:", error)
            throw new Error("Error al Buscar la Recuperación de Email")
        }
    }
}

export default EmailRecoveryProvider;