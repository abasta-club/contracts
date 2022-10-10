import { ethers, network } from "hardhat"

import networkConfig from "../../networkConfig"

const {
  ABTFactory: { uri, paymentToken, membershipFee, owner },
} = networkConfig

async function main() {
  console.log("🚀 About to deploy ABT Factory")
  console.log("===========================================================")
  console.log(`network: ${network.name}`)
  console.log(`uri: ${uri}`)
  console.log(`paymentToken: ${paymentToken}`)
  console.log(`membershipFee: ${membershipFee}`)
  console.log(`owner: ${owner}`)
  const ABTFactory = await ethers.getContractFactory("ABTFactory")
  const aBTFactory = await ABTFactory.deploy(uri, paymentToken, membershipFee, owner)

  await aBTFactory.deployed()

  console.log("✅ ABTFactory deployed to: ", aBTFactory.address)
  console.log("===========================================================")

  console.log("About to mint 5 tokens of each type for owner")

  const mintTx = await aBTFactory.mintBatch(owner, [1, 2], [5, 5])
  const mintReceipt = await mintTx.wait()
  console.log(`✅ Tokens minted!. Tx hash: ${mintReceipt.transactionHash}`)
  console.log("===========================================================")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
