import { Contract, ContractFactory } from "@ethersproject/contracts"
import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { parseEther } from "ethers/lib/utils"

const PAYMENT_TOKEN_NAME = "Payment Token"
const PAYMENT_TOKEN_SYMBOL = "PTOK"
const PAYMENT_TOKEN_SUPPLY = parseEther("1000000")

const INITIAL_URI =
  "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu"
const INITIAL_SUBS_FEE = parseEther("100")
const PAYMENT_TOKEN_USRES_BALANCE = parseEther("200")
const PARTNER_ID = 1
const SUPPORTER_ID = 2

describe("AbastaDAOToken contract", () => {
  let ABTFactory: ContractFactory,
    abtFactory: Contract,
    PaymentToken: ContractFactory,
    paymentToken: Contract,
    owner: SignerWithAddress,
    partner: SignerWithAddress,
    partnerVolunteer: SignerWithAddress,
    supporter: SignerWithAddress,
    supporterVolunteer: SignerWithAddress

  before(async () => {
    ;[owner, partner, partnerVolunteer, supporter, supporterVolunteer] = await ethers.getSigners()

    PaymentToken = await ethers.getContractFactory("MockERC20")
    paymentToken = await PaymentToken.deploy(
      PAYMENT_TOKEN_NAME,
      PAYMENT_TOKEN_SYMBOL,
      PAYMENT_TOKEN_SUPPLY
    )
    await paymentToken.deployed()

    // distribute payment tokens to users
    await paymentToken.transfer(partner.address, PAYMENT_TOKEN_USRES_BALANCE)
    await paymentToken.transfer(partnerVolunteer.address, PAYMENT_TOKEN_USRES_BALANCE)
    await paymentToken.transfer(supporter.address, PAYMENT_TOKEN_USRES_BALANCE)
    await paymentToken.transfer(supporterVolunteer.address, PAYMENT_TOKEN_USRES_BALANCE)


    ABTFactory = await ethers.getContractFactory("ABTFactory")
    abtFactory = await ABTFactory.deploy(
      INITIAL_URI,
      paymentToken.address,
      INITIAL_SUBS_FEE,
      owner.address
    )
    await abtFactory.deployed()
  })

  describe("Initial configuration", () => {
    it("Should set proper URI", async () => {
      const idRequest = 0
      const uri = await abtFactory.uri(idRequest)
      const paymentT = await abtFactory.paymentToken()
      expect(paymentT).to.equal(paymentToken.address)
      expect(uri).to.equal(INITIAL_URI)
    })
  })

  describe("Should mint tokend on claim", () => {
    it("Should mint supporter token", async () => {

      const approveTx = await paymentToken
        .connect(supporter)
        .approve(abtFactory.address, INITIAL_SUBS_FEE)
      await approveTx.wait()

      const claimTx = await abtFactory.connect(supporter).claimSupporter(false)
      await claimTx.wait()

      const balance = await abtFactory.balanceOf(supporter.address, SUPPORTER_ID)
      expect(Number(balance.toString())).to.eql(1)
    })

    it("Should mint partner token", async () => {

      const approveTx = await paymentToken
        .connect(partner)
        .approve(abtFactory.address, INITIAL_SUBS_FEE)
      await approveTx.wait()

      const claimTx = await abtFactory.connect(partner).claimPartnership(false)
      await claimTx.wait()

      const balance = await abtFactory.balanceOf(partner.address, PARTNER_ID)
      expect(Number(balance.toString())).to.eql(1)
    })

    describe("Volunteers", () => {
      it("Should claim a free token as supporter", async () => {
        const claimTx = await abtFactory.connect(supporterVolunteer).claimSupporter(true)
        await claimTx.wait()

        const balance = await abtFactory.balanceOf(supporterVolunteer.address, SUPPORTER_ID)
        expect(Number(balance.toString())).to.eql(1)
      })
      it("Should claim a free token as partner", async () => {
        const claimTx = await abtFactory.connect(partnerVolunteer).claimPartnership(true)
        await claimTx.wait()

        const balance = await abtFactory.balanceOf(partnerVolunteer.address, PARTNER_ID)
        expect(Number(balance.toString())).to.eql(1)
      })
    })
  })
})
