import { ethers } from "hardhat"

import networkConfig from "../../networkConfig"

const {
  ABTFactory: { deployedAddress },
} = networkConfig

const MINT_TO = ""

async function main() {
  console.log("🚀 About to mint some ABTs")
  const ABTFactory = await ethers.getContractFactory("ABTFactory")
  const abtFactory = ABTFactory.attach(deployedAddress)

  const [owner] = await ethers.getSigners()

  const mintTx = await abtFactory.connect(owner).mintBatch(MINT_TO, [1, 2], [5, 5])
  const mintReceipt = await mintTx.wait()

  console.log(`Tokens minted!. Tx hash: ${mintReceipt.transactionHash}`)

  console.log("===========================================================")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
