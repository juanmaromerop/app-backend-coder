import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filaname = fileURLToPath(import.meta.url);
const __dirname = dirname(__filaname)

export default __dirname