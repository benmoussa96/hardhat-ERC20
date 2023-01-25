export interface networkConfigItem {
  name?: string;
  blockConfirmations?: number;
  initialSupply?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  1: {
    name: "mainnet",
    blockConfirmations: 6,
    initialSupply: 1000000000,
  },
  5: {
    name: "goerli",
    blockConfirmations: 6,
    initialSupply: 1000000000,
  },
  137: {
    name: "polygon",
    blockConfirmations: 6,
    initialSupply: 1000000000,
  },
  31337: {
    name: "localhost",
    initialSupply: 1000000000,
  },
};

// export const developmentChains = [31337];

export const developmentChains = ["hardhat", "localhost"];
