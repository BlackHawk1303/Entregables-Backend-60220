// import { Router } from "express";

// const router = new Router()

// router.get('/:entorno', (req, res) => {
//     //req.loggers.warning("SantosBacalaos!!!")
//     req.loggers.fatal(`${req.method} en ${req.url} - HORA ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO FATAL <-----`)
//     req.loggers.error(`${req.method} en ${req.url} - HORA ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO ERROR <-----`)
//     req.loggers.warning(`${req.method} en ${req.url} - HORA ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO WARNING <-----`)
//     req.loggers.http(`${req.method} en ${req.url} - HORA ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO HTTP <-----`)
//     req.loggers.info(`${req.method} en ${req.url} - HORA ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -----> MENSAJE DE TIPO INFO <-----`)
//     req.loggers.debug(`${req.method} en ${req.url} - HORA ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} -----> MENSAJE SOLO VISIBLE PARA EL MODE DEV <-----`)
//     res.send("Eh yo")
// })

// export default router

import { Router } from "express";
import { format } from "date-fns"; 

const router = new Router();

router.get('/', (req, res) => {
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const { method, url } = req;


    
    req.loggers.fatal(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Ocurrió un Error Crítico que Requiere Atención Inmediata.`)
    req.loggers.error(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Ocurrió un Error en la Aplicación.`);
    req.loggers.warning(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Advertencia Sobre un Posible Problema.`)
    req.loggers.http(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Información de la Solicitud HTTP Recibida.`)
    req.loggers.info(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Información General sobre la Operación de la Aplicación.`)
    req.loggers.debug(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Mensaje de Depuración solo Visible en Modo Desarrollo. [Dev]`)
    
    res.send("Logs Generados");
});

export default router;