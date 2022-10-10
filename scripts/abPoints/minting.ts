import { parseEther } from "ethers/lib/utils"
import { ethers, network } from "hardhat"

import networkConfig from "../../networkConfig"

const {
  ABPoints: { deployedAddress },
} = networkConfig

async function main() {
  console.log("🚀 About to mint some AB Points")
  console.log("===========================================================")
  console.log(`network: ${network.name}`)
  console.log(`using token on address: ${deployedAddress}`)
  const ABPoints = await ethers.getContractFactory("ABPoints")
  const abPoints = await ABPoints.attach(deployedAddress)

  const [owner] = await ethers.getSigners()

  const receiver = "0x521111b8028958aE6e56C87339a39EB6D91e9160"
  const amount = parseEther("100000")
  const mintTx = await abPoints.connect(owner).mint(receiver, amount)
  const mintReceipt = await mintTx.wait()

  console.log(`Tokens minted! Tx hash: ${mintReceipt.transactionHash}`)
  console.log("===========================================================")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
