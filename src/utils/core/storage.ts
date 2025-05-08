import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import path from 'path';

export function root_path(pathStr: string) {
    return path.resolve(process.cwd(), pathStr);
}