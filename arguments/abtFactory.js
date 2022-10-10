const networkConfig = require("../networkConfig")

const {
  ABTFactory: { uri, paymentToken, membershipFee, owner },
} = networkConfig

console.log("Verifying ABT Factory contract...")
console.log({ uri, paymentToken, membershipFee, owner })

module.exports = [uri, paymentToken, membershipFee, owner]
