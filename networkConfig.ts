import * as dotenv from "dotenv"
import * as configFile from "./config.json"

dotenv.config()

const env: string = process.env.NETWORK_NAME || "local"

export default (configFile as any)[env]
