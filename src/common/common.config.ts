import * as fs from 'fs'

export function parseEnv() {
    return JSON.parse(fs.readFileSync('.env.json') + "")
}