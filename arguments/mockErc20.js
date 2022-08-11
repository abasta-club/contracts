const networkConfig = require("../networkConfig")

// FIXME: shouldn't be needed to get the network name, the config should export network data only
const env = process.env.NETWORK_NAME || "local"

const {
  erc20PaymentToken: { symbol, name, initialSupply },
} = networkConfig[env]

console.log("Verifying Mock ERC20 Payment token contract...")
console.log({ symbol, name, initialSupply })

module.exports = [symbol, name, initialSupply]
