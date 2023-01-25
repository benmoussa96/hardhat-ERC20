import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { BenToken } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BenToken", async () => {
      let ourToken: BenToken,
        deployer: SignerWithAddress,
        user1: SignerWithAddress;
      const chainId: number = network.config.chainId!;

      beforeEach(async function () {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];

        await deployments.fixture("all");
        ourToken = await ethers.getContract("OurToken", deployer);
      });

      it("Should have correct INITIAL_SUPPLY of token ", async function () {
        const initialSupply = networkConfig[chainId]["initialSupply"];
        const totalSupply = await ourToken.totalSupply();
        expect(totalSupply.toString()).to.equal(initialSupply);
      });

      it("Should be able to transfer tokens successfully to an address", async function () {
        const tokensToSend = ethers.utils.parseEther("10");
        await ourToken.transfer(user1.address, tokensToSend);
        expect(await ourToken.balanceOf(user1.address)).to.equal(tokensToSend);
      });

      it("Should approve other address to spend token", async () => {
        const tokensToSpend = ethers.utils.parseEther("5");
        await ourToken.approve(user1.address, tokensToSpend);
        const ourToken1 = await ethers.getContract("OurToken", user1);
        await ourToken1.transferFrom(
          deployer.address,
          user1.address,
          tokensToSpend
        );
        expect(await ourToken1.balanceOf(user1.address)).to.equal(
          tokensToSpend
        );
      });
    });
