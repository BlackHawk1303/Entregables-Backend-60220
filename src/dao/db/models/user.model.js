import mongoose from 'mongoose'

const collection = 'users'
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        min: 0
    },
    password: {
        type: String,
        required: true,
        //minlength: 8
    },
    loggedMethod:{
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role:{
        type:String,
        default: "user"
    },
    documents: {
        type: [{
            doc_name: {type: String},
            reference: {type: String},
        }],
        default: []
    },
    last_connection: {type: String,
        default: ""
    }
    
});
const userModel = mongoose.model(collection, userSchema)

export default userModel