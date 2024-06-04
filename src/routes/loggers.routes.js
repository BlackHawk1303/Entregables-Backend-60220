import { Router } from "express"
import { format } from "date-fns"

const router = new Router();

router.get('/', (req, res) => {
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const { method, url } = req;


    
    req.loggers.fatal(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Ocurrió un Error Crítico que Requiere Atención Inmediata.`)
    req.loggers.error(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Ocurrió un Error en la Aplicación.`)
    req.loggers.warning(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Advertencia Sobre un Posible Problema.`)
    req.loggers.http(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Información de la Solicitud HTTP Recibida.`)
    req.loggers.info(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Información General sobre la Operación de la Aplicación.`)
    req.loggers.debug(`${method} request en ${url} - Fecha y Hora: ${currentDateTime} - Descripción: Mensaje de Depuración solo Visible en Modo Desarrollo. [Dev]`)
    
    res.send("Logs Generados")
});

export default router