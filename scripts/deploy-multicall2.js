const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy StakingRewards
  const Multicall = await ethers.getContractFactory("Multicall2");
  const multicallContract = await Multicall.deploy();
  await multicallContract.deployed();

  console.log("Multicall address: ", multicallContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
