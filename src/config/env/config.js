import dotenv from 'dotenv'
import __dirname from '../../utils.js'

dotenv.config({ path: __dirname + '/config/env/.env.development' })

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    secretId: process.env.GITHUB_SECRET_ID,
    clientId: process.env.GITHUB_CLIENT_ID,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailPass: process.env.GMAIL_PASS
}