const config = require("../networkConfig")

// FIXME: shouldn't be needed to get the network name, the config should export network data only
const env = process.env.NETWORK_NAME || "local"

const { uri, dai, membershipFee, owner } = config[env]

console.log("Verifying ABT Factory contract...")
console.log({ uri, dai, membershipFee, owner })

module.exports = [uri, dai, membershipFee, owner]
