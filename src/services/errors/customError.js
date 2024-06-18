// export default class CustomError {
//     constructor(message, name = "CustomError", cause = null) {
//         super(message);
//         this.name = name;
//         if (cause) {
//             this.cause = new Error(cause);
//         }
//     }
// }

export default class CustomError {
    static createError({ name = "Error", cause, message }) {
        const error = new Error(message)
        error.name = name
        error.cause = cause ? new Error(cause) : null
        throw error
    }
}
