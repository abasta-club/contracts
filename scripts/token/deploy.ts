import { ethers, network } from "hardhat"

import networkConfig from "../../networkConfig"

// FIXME: shouldn't be needed to get the network name, the config should export network data only
const env: string = process.env.NETWORK_NAME || "local"

const { uri, dai, membershipFee, owner } = networkConfig[env]

async function main() {

  console.log("🚀 About to deploy ABT Factory")
  console.log("===========================================================")
  console.log(`network: ${network.name}`)
  console.log(`uri: ${uri}`)
  console.log(`dai: ${dai}`)
  console.log(`membershipFee: ${membershipFee}`)
  console.log(`owner: ${owner}`)
  const ABTFactory = await ethers.getContractFactory("ABTFactory")
  const aBTFactory = await ABTFactory.deploy(uri, dai, membershipFee, owner)

  await aBTFactory.deployed()

  console.log("✅ ABTFactory deployed to:", aBTFactory.address)
  console.log("===========================================================")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
