import { Contract, ContractFactory } from "@ethersproject/contracts";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";

const INITIAL_URI =
  "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu";
const PAYMENT_TOKEN_SUPPLY = parseEther("100000");
const INITIAL_SUBS_FEE = parseEther("100");

describe("AbastaDAOToken contract", () => {
  let AbastaDAOToken: ContractFactory;
  let abastaDAOToken: Contract;

  let PaymentToken: ContractFactory;
  let paymentToken: Contract;

  let owner: SignerWithAddress;

  before(async () => {
    [owner] = await ethers.getSigners();

    // deploy private token - mock erc20 token
    PaymentToken = await ethers.getContractFactory("MockERC20");
    paymentToken = await PaymentToken.deploy(
      "paymentToken",
      "PAT",
      PAYMENT_TOKEN_SUPPLY
    );
    await paymentToken.deployed();

    AbastaDAOToken = await ethers.getContractFactory("AbastaDAOToken");
    abastaDAOToken = await AbastaDAOToken.deploy(
      paymentToken.address,
      INITIAL_SUBS_FEE
    );
    await abastaDAOToken.deployed();
  });

  describe("Initial configuration", () => {
    it("Should set proper URI", async () => {
      const idRequest = 0;
      const uri = await abastaDAOToken.uri(idRequest);
      expect(uri).to.equal(INITIAL_URI);
    });
  });
});
