import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collection = 'users';
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
    }
    
});
// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         user.password = hashedPassword;
//     }
//     next();
// });

// userSchema.pre('find', function () {
//     this.populate("carts")
// }
// )
const userModel = mongoose.model(collection, userSchema);

export default userModel;