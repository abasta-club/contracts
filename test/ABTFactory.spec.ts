import { Contract, ContractFactory } from "@ethersproject/contracts";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";

const PAYMENT_TOKEN_NAME = "Payment Token";
const PAYMENT_TOKEN_SYMBOL = "PTOK";
const PAYMENT_TOKEN_SUPPLY = parseEther("1000000");

const INITIAL_URI =
  "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu";
const INITIAL_SUBS_FEE = parseEther("100");

describe("AbastaDAOToken contract", () => {
  let ABTFactory: ContractFactory,
    abtFactory: Contract,
    PaymentToken: ContractFactory,
    paymentToken: Contract,
    owner: SignerWithAddress;

  before(async () => {
    [owner] = await ethers.getSigners();
    PaymentToken = await ethers.getContractFactory("MockERC20");
    paymentToken = await PaymentToken.deploy(
      PAYMENT_TOKEN_NAME,
      PAYMENT_TOKEN_SYMBOL,
      PAYMENT_TOKEN_SUPPLY
    );
    await paymentToken.deployed();

    ABTFactory = await ethers.getContractFactory("ABTFactory");
    abtFactory = await ABTFactory.deploy(
      INITIAL_URI,
      paymentToken.address,
      INITIAL_SUBS_FEE,
      owner.address
    );
    await abtFactory.deployed();
  });

  describe("Initial configuration", () => {
    it("Should set proper URI", async () => {
      const idRequest = 0;
      const uri = await abtFactory.uri(idRequest);
      expect(uri).to.equal(INITIAL_URI);
    });
  });
});
