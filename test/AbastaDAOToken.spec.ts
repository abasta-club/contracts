import { Contract, ContractFactory } from "@ethersproject/contracts";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const INITIAL_URI = "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu";

describe("AbastaDAOToken contract", () => {
  let AbastaDAOToken: ContractFactory;
  let abastaDAOToken: Contract;

  let owner: SignerWithAddress

  before(async () => {
    [owner] = await ethers.getSigners();

    AbastaDAOToken = await ethers.getContractFactory("AbastaDAOToken");
    abastaDAOToken = await AbastaDAOToken.deploy();
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
