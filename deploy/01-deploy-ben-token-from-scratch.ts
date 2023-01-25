import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployBenTokenFromScratch: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  const initialSupply = networkConfig[chainId]["initialSupply"];
  const TOKEN_NAME = process.env.TOKEN_NAME;
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;

  const lockArgs = [initialSupply, TOKEN_NAME, TOKEN_SYMBOL];

  const benToken = await deploy("BenTokenFromScratch", {
    from: deployer,
    args: lockArgs,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(benToken.address, lockArgs);
  }
};

export default deployBenTokenFromScratch;
deployBenTokenFromScratch.tags = ["all", "bentokenfromscratch"];
