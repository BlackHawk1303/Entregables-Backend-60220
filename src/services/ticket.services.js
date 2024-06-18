import TicketModel  from "../dao/db/models/ticket.js";
import { v4 as uuid } from "uuid";
// import moment from "moment";
import EmailSender from "./email.services.js";

class TicketProvider {
    constructor() {}

    async createTicket(data) {
        try {
            const ticket = await this.createTicketData(data);
            await this.sendEmail(ticket);
            return ticket;
        } catch (error) {
            console.error("Error al Crear el Ticket:", error);
            throw error; 
        }
    }

    async createTicketData(data) {
        const actualDate = this.getCurrentDateTime();
        const ticket = {
            code: uuid(),
            purchase_dateTime: actualDate,
            amount: data.amount,
            purchaser: data.purchaser
        };
        return TicketModel.create(ticket);
    }

    async sendEmail(ticket) {
        try {
            const emailManager = new EmailSender();
            const emailStatus = await emailManager.sendEmail(ticket);
            console.log(emailStatus);
        } catch (error) {
            console.error("Error al Enviar el Correo Electrónico:", error);
        }
    }

    getCurrentDateTime() {
        const date = new Date();
        const yr = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hrs = date.getHours().toString();
        const min = date.getMinutes().toString();
        return `${day}/${month}/${yr} ${hrs}:${min}`;
    }
}

export default TicketProvider;