const networkConfig = require("../networkConfig")

const {
  erc20PaymentToken: { symbol, name, initialSupply },
} = networkConfig

console.log("Verifying Mock ERC20 Payment token contract...")
console.log({ symbol, name, initialSupply })

module.exports = [symbol, name, initialSupply]
