import { ethers, network } from "hardhat"

async function main() {
  console.log("🚀 About to deploy AB Points")
  console.log("===========================================================")
  console.log(`network: ${network.name}`)
  const ABPoints = await ethers.getContractFactory("ABPoints")
  const abPoints = await ABPoints.deploy()

  await abPoints.deployed()

  console.log("✅ ABPoints deployed to: ", abPoints.address)
  console.log("===========================================================")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
