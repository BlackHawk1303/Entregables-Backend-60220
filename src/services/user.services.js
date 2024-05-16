import userModel from "../dao/db/models/user.model.js";
class UserProvider {
    constructor() { }
    findUser = async (query) => {
        try {
            const user = await userModel.findOne(query);
            return user;
        } catch (error) {
            console.error("Error al Buscar Usuario:", error.message);
            throw new Error("Error al Buscar Usuario en la Base de Datos");
        }
    }
    createUser = async (userData) => {
        try {
            const newUser = await userModel.create(userData);
            return newUser;
        } catch (error) {
            console.error("Error al Crear Usuario:", error.message);
            throw new Error("Error al Crear Usuario en la Base de Datos");
        }
    }
    deleteUser = async (userId) => {
        try {
            const deletionStatus = await userModel.deleteOne({ _id: userId });
            return deletionStatus;
        } catch (error) {
            console.error("Error al Eliminar Usuario:", error.message);
            throw new Error("Error al Eliminar Usuario de la Base de Datos");
        }
    }
}

export default UserProvider;