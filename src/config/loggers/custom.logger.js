import winston, { transports } from 'winston'
import config from "../env/config.js"

const customOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        http: 3,
        info: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        http:'cyan',
        info: 'blue',
        debug: 'green'
    }
}

winston.addColors(customOptions.colors)
const devLoggers = winston.createLogger({
    levels: customOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './devErrors.log',
            level: 'debug',
            format: winston.format.simple()
        }),
    ]
})

const prodLoggers = winston.createLogger({
    levels: customOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './prodErrors.log',
            level: 'info',
            format: winston.format.simple()
        }),
    ]
})

export const logger = (req, res, next) => {
    const condition = config.enviroment
    
    if (condition === "dev")
    {        
        req.loggers = devLoggers
    }
    else {
        req.loggers = prodLoggers
    }
    next()
}