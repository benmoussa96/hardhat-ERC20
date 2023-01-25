import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { BenToken } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("BenToken", async () => {
      let benToken: BenToken,
        deployer: SignerWithAddress,
        user1: SignerWithAddress;
      const chainId: number = network.config.chainId!;

      beforeEach(async function () {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];

        await deployments.fixture("all");
        benToken = await ethers.getContract("BenToken", deployer);
      });

      it("Should have correct INITIAL_SUPPLY of token ", async function () {
        const initialSupply = networkConfig[chainId]["initialSupply"];
        const totalSupply = await benToken.totalSupply();
        expect(totalSupply).to.equal(initialSupply);
      });

      it("Should be able to transfer tokens successfully to an address", async function () {
        const tokensToSend = 10;
        await benToken.transfer(user1.address, tokensToSend);
        expect(await benToken.balanceOf(user1.address)).to.equal(tokensToSend);
      });

      it("Should approve other address to spend token", async () => {
        const tokensToSpend = 5;
        await benToken.approve(user1.address, tokensToSpend);
        const benToken1 = await ethers.getContract("BenToken", user1);
        await benToken1.transferFrom(
          deployer.address,
          user1.address,
          tokensToSpend
        );
        expect(await benToken1.balanceOf(user1.address)).to.equal(
          tokensToSpend
        );
      });
    });
