import userModel from "../dao/db/models/user.model.js"
import moment from "moment"
import EmailSender from "../services/email.services.js"

const emailSender = new EmailSender()
class UserProvider {
    constructor() { }
    findUser = async (query) => {
        try {
            const user = await userModel.findOne(query)
            return user
        } catch (error) {
            console.error("Error al Buscar Usuario:", error.message)
            throw new Error("Error al Buscar Usuario en la Base de Datos")
        }
    }
    createUser = async (userData) => {
        try {
            const newUser = await userModel.create(userData)
            return newUser
        } catch (error) {
            console.error("Error al Crear Usuario:", error.message)
            throw new Error("Error al Crear Usuario en la Base de Datos")
        }
    }
    deleteUser = async (userId) => {
        try {
            const deletionStatus = await userModel.deleteOne({ _id: userId })
            return deletionStatus
        } catch (error) {
            console.error("Error al Eliminar Usuario:", error.message)
            throw new Error("Error al Eliminar Usuario de la Base de Datos")
        }
    }

    updateUser = async (userId, data) => {
        try {
            const updateStatus = await userModel.updateOne(userId, data)
            return updateStatus
        } catch (error) {
            console.error("Error al Modificar Usuario:", error.message)
            throw new Error("Error al Modificar Usuario de la Base de Datos")
        }
    }

    findAll = async () => {
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            console.error("Error al Buscar Usuarios:", error.message)
            throw new Error("Error al Buscar Usuarios en la Base de Datos")
        }
    }

    deleteUserByTime = async () => {
        try {
            const limitDate = moment().subtract(2, 'days').toDate()
            const inactiveUsers = await userModel.find({ lastLogin: { $lt: limitDate } })
            for (const user of inactiveUsers) {
                await userModel.deleteOne({ _id: user._id })
                await emailSender.sendDeletionEmail(user)
            }
            return { deletedCount: inactiveUsers.length }
        } catch (error) {
            console.error("Error al Eliminar Usuarios por:", error.message)
            throw new Error("Error al Eliminar Usuarios en la BD")
        }
    }
}
export default UserProvider;