import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const passwordHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const validpass = (user, pass) => { return bcrypt.compareSync(pass, user.password) }
export default __dirname;

