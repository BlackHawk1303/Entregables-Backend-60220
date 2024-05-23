import moongose from "mongoose"

const messageCollection = 'message'

const messageSchema = new moongose.Schema({
    email:String,
    message:String
})

export const messageModel = moongose.model(messageCollection, messageSchema)