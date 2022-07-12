import * as dotenv from "dotenv"
import * as configFile from "./networkConfig.json"

// dotenv.config()

const env: string = process.env.NETWORK_NAME || "local"

export default (configFile as any)[env]
