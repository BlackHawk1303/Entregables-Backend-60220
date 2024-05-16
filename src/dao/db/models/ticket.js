import mongoose from "mongoose";

const ticketCollection = 'ticket';

const requiredString = {
    type: String,
    required: true
};

//Operador de Propagación ... Extiende el esquema requiredSstring
//con uniqueRequiredString
const uniqueRequiredString = {
    ...requiredString,
    unique: true
};

const requiredNumber = {
    type: Number,
    required: true
};

const ticketSchema = new mongoose.Schema({
    code: uniqueRequiredString,
    purchase_dateTime: requiredString,
    amount: requiredNumber,
    purchaser: requiredString
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

export default TicketModel;