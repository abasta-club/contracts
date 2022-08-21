import { Contract, ContractFactory } from "@ethersproject/contracts"
import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { parseEther } from "ethers/lib/utils"

const PAYMENT_TOKEN_NAME = "Payment Token"
const PAYMENT_TOKEN_SYMBOL = "PTOK"
const PAYMENT_TOKEN_SUPPLY = parseEther("1000000")

const URI =
  "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu"
const MEMBERSHIP_FEE = parseEther("100")
const PAYMENT_TOKEN_USERS_BALANCE = parseEther("200")
const PARTNER_ID = 1
const SUPPORTER_ID = 2

describe("AbastaDAOToken contract", () => {
  let ABTFactory: ContractFactory,
    abtFactory: Contract,
    PaymentToken: ContractFactory,
    paymentToken: Contract,
    // users
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
    await paymentToken.transfer(partner.address, PAYMENT_TOKEN_USERS_BALANCE)
    await paymentToken.transfer(partnerVolunteer.address, PAYMENT_TOKEN_USERS_BALANCE)
    await paymentToken.transfer(supporter.address, PAYMENT_TOKEN_USERS_BALANCE)
    await paymentToken.transfer(supporterVolunteer.address, PAYMENT_TOKEN_USERS_BALANCE)

    ABTFactory = await ethers.getContractFactory("ABTFactory")
    abtFactory = await ABTFactory.deploy(
      URI,
      paymentToken.address,
      MEMBERSHIP_FEE,
      owner.address
    )
    await abtFactory.deployed()
  })

  describe("Initial configuration", () => {
    it("Should set proper URI", async () => {
      const idRequest = 0
      const uri = await abtFactory.uri(idRequest)
      expect(uri).to.equal(URI)
    })

    it("Should set proper membership fee", async () => {
      const membFee = await abtFactory.membershipFee()
      expect(membFee).to.equal(MEMBERSHIP_FEE)
    })

    it("Should set proper owner", async () => {
      const contractOwner = await abtFactory.owner()
      expect(contractOwner).to.equal(owner.address)
    })

    it("Should set proper payment token", async () => {
      const paymentT = await abtFactory.paymentToken()
      expect(paymentT).to.equal(paymentToken.address)
    })
  })

  describe.skip("Token claim ", () => {
    describe("Supporter", () => {
      it("Should be able to claim as supporter", async () => {
        const approveTx = await paymentToken
          .connect(supporter)
          .approve(abtFactory.address, MEMBERSHIP_FEE)
        await approveTx.wait()

        const claimTx = await abtFactory.connect(supporter).claimSupporter(false)
        await claimTx.wait()

        const balance = await abtFactory.balanceOf(supporter.address, SUPPORTER_ID)
        expect(Number(balance.toString())).to.eql(1)
      })
      it.skip("Should not be able to claim if not whitelisted", async () => { })
      it.skip("Should not be able to claim more than 1", async () => { })
    })

    describe("Partner", () => {
      it("Should be able to claim as partner", async () => {
        const approveTx = await paymentToken
          .connect(partner)
          .approve(abtFactory.address, MEMBERSHIP_FEE)
        await approveTx.wait()

        const claimTx = await abtFactory.connect(partner).claimPartner(false)
        await claimTx.wait()

        const balance = await abtFactory.balanceOf(partner.address, PARTNER_ID)
        expect(Number(balance.toString())).to.eql(1)
      })

      it("Should mint supporter token", async () => {
        const approveTx = await paymentToken
          .connect(supporter)
          .approve(abtFactory.address, MEMBERSHIP_FEE)
        await approveTx.wait()

        const claimTx = await abtFactory.connect(supporter).claimSupporter(false)
        await claimTx.wait()

        const balance = await abtFactory.balanceOf(supporter.address, SUPPORTER_ID)
        expect(Number(balance.toString())).to.eql(1)
      })

      it("Should mint partner token", async () => {
        const approveTx = await paymentToken
          .connect(partner)
          .approve(abtFactory.address, MEMBERSHIP_FEE)
        await approveTx.wait()

        const claimTx = await abtFactory.connect(partner).claimPartnership(false)
        await claimTx.wait()

        const balance = await abtFactory.balanceOf(partner.address, PARTNER_ID)
        expect(Number(balance.toString())).to.eql(1)
      })


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
      it.skip("Should not be able to claim if not whitelisted as volunteer", async () => {
        // test both, partner and supporter
      })
    })
  })

  describe("Restricted to owner", () => {
    // test allowance to owner and not allowance non-owners
    describe.skip("Set URI", () => {
      it("Should be able to set uri", async () => {
        const newURI = "newUri"
        const setURITx = await abtFactory.connect(owner).setURI(newURI)
        await setURITx.wait()

        const uri = await abtFactory.uri(0)
        expect(uri).to.equal(newURI)

        await expect(setURITx).to.emit(abtFactory, "UriSet").withArgs(owner.address, newURI)
      })

      it("Should not be able to set uri as non owner", async () => { })
    })

    describe.skip("Set membership fee", () => { })
    it("Should be able to mint any token to anyone", async () => { })
    it("Should be able to set membership fee", async () => { })
  })
})
