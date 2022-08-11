import { ethers, network } from "hardhat"

import networkConfig from "../../networkConfig"

const {
  erc20PaymentToken: { symbol, name, initialSupply },
} = networkConfig

async function main() {
  console.log("🚀 About to deploy MockERC20 token")
  console.log("===========================================================")
  console.log(`network: ${network.name}`)
  console.log(`symbol: ${symbol}`)
  console.log(`name: ${name}`)
  console.log(`initialSupply: ${initialSupply}`)
  const ERC20PaymentToken = await ethers.getContractFactory("MockERC20")
  const erc20PaymentToken = await ERC20PaymentToken.deploy(symbol, name, initialSupply)

  await erc20PaymentToken.deployed()

  console.log("✅ ERC20PaymentToken deployed to:", erc20PaymentToken.address)
  console.log("===========================================================")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
