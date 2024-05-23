import dotenv from 'dotenv'
import __dirname from '../../utils.js'
import { Command } from 'commander'
//import path from 'path'

//dotenv.config({ path: __dirname + '/config/env/.env.development' })

const commands = new Command()

commands
.option ('--mode <node>', 'Enviroment used', 'dev')
commands.parse()
console.log("Running in mode: " + commands.opts().mode)
const enviroment = commands.opts().mode

dotenv.config({
    path: enviroment === "prod" ? __dirname  +  '/config/env/.env.production' : __dirname + '/config/env/.env.development'
})



export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    secretId: process.env.GITHUB_SECRET_ID,
    clientId: process.env.GITHUB_CLIENT_ID,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailPass: process.env.GMAIL_PASS,
    enviroment: enviroment
}