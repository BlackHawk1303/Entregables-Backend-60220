import nodemailer from 'nodemailer'
import configEnv from "../config/env/config.js"

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
            to: data.purchaser,
            subject: "Prueba de Confirmación de Compra",
            html: `<div>Su Compra fué Realizada con Éxito<br>
                Fecha: ${data.purchase_dateTime}<br>
                Cantidad: ${data.amount}<br>
                Correo: ${data.purchaser}   
            </div>`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            //%s es un Marcador de Posición
            console.log("Mensaje Enviado: %s", info.messageId);
            return "success";
        } catch (error) {
            console.error("Error al Enviar Email:", error);
            return "error";
        }
    }
    sendRecoverEmail = async (data, enlace, email) => {

        const mailOptions = {
            from: configEnv.gmailAccount,
            to: email,
            subject: "TEST --- Recuperación de tu Contraseña",
            html: `Solicitud de Recuperación de Contraseña                
                Enlace: ${enlace}/recovery/${data.recoverID}
                
                IMPORTANTE: Este Enlace Tiene una Duración de 60:00 min.           
            `
        }
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
    // Nuevo Método para Enviar Email de Eliminación
    sendDeletionEmail = async (user) => {
        const mailOptions = {
            from: configEnv.gmailAccount,
            to: user.email,
            subject: "Cuenta Eliminada por Inactividad",
            html: `<div>
                Estimado/a ${user.first_name} ${user.last_name},<br><br>
                Su Cuenta ha Sido Eliminada Debido a Inactividad Durante los Últimos 2 Días.<br><br>
                Si Cree que Esto es un Error, Por Favor Póngase en Contacto con Nuestro Soporte.
            </div>`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Mensaje de Eliminación Enviado: %s", info.messageId);
            return "success";
        } catch (error) {
            console.error("Error al Enviar Email de Eliminación:", error);
            return "error";
        }
    }
}

export default EmailSender;