const { ethers } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  // deploy function
  async function deploy(factory, args) {
    await delay(5000);
    var ContractFactory = await ethers.getContractFactory(factory);
    var contract = await ContractFactory.deploy(...args);
    await contract.deployed();
    await confirmTransactionCount();
    console.log(contract.address, ":", factory);
    return contract;
  }

  //////////////////////////////////////////////////
  // CHANGE THESE VARIABLES BASED ON YOUR NETWORK //
  //////////////////////////////////////////////////

  const contractAddresses = CHAINS[ChainId.FUJI].contracts;
  const foundationAddress = "0x84aC4A9923bb5864Db6F85aCF6811708b88BDc49"; // multisig, not added in SDK yet.
  const PNG_SYMBOL = "PNG";
  // png: contractAddresses.png
  // factory: contractAddresses.factory
  // nativeToken: contractAddresses.wrapped_native_token
  // foundation:
  //////////////////////////////////////////////////

  // deploying SAR farm
  const chef = await deploy("PangoChef", [
    contractAddresses.png,
    deployer.address,
    contractAddresses.factory,
    contractAddresses.wrapped_native_token,
  ]);
  const chefFundForwarder = await deploy("RewardFundingForwarder", [
    chef.address,
  ]);

  // deploying SAR staking
  const stakingMetadata = await deploy("TokenMetadata", [
    foundationAddress,
    PNG_SYMBOL,
  ]);
  const staking = await deploy("PangolinStakingPositions", [
    png.address,
    deployer.address,
    stakingMetadata.address,
  ]);
  const stakingFundForwarder = await deploy("RewardFundingForwarder", [
    staking.address,
  ]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
