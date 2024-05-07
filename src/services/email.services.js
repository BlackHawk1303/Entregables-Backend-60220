import nodemailer from 'nodemailer';
import configEnv from "../config/env/config.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: configEnv.gmailAccount,
        pass: configEnv.gmailPass
    }
});

transporter.verify((error) => {
    if (error) {
        console.error("Error al Conectar con el Servidor de Correo:", error);
    } else {
        console.log('El Servidor de Correo está Listo para Enviar Mensajes');
    }
});

class EmailSender {
    constructor() { }
    async sendEmail(data) {
        const mailOptions = {
            from: configEnv.gmailAccount,
            to: configEnv.gmailAccount, 
            subject: "Prueba de Confirmación de Compra",
            html: `<div>Su Compra fué Realizada con Éxito<br>
                Fecha: ${data.purchase_dateTime}<br>
                Cantidad: ${data.amount}<br>
                Correo: ${data.purchaser}   
            </div>`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            //%s es un marcador de posición
            console.log("Mensaje Enviado: %s", info.messageId);
            return "success";
        } catch (error) {
            console.error("Error al Enviar Email:", error);
            return "error";
        }
    }
}

export default EmailSender;