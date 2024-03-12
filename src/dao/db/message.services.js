import { messageModel } from "./models/chat.js"

export default class messageServices{
    constructor()
    { } 
    
    storeMessage = async (message) => {
        let check = messageModel.create(message)
        return check
    }

    getMessage = async () =>{
        let messages = await messageModel.find()
        return messages.map(data => data.toObject())
    }

}