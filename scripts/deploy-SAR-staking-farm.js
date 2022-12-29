const { ethers } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");
const {
  PNG_SYMBOL,
  PNG_NAME,
  WRAPPED_NATIVE_TOKEN,
  VESTER_ALLOCATIONS,
  REVENUE_DISTRIBUTION,
} = require(`../constants/${network.name}.js`);

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  ////////////////////////////
  // CHANGE THESE VARIABLES //
  ////////////////////////////
  const isDeployingActive = true;
  const contractAddresses = CHAINS[ChainId.FUJI].contracts;
  // png: contractAddresses.png
  // factory: contractAddresses.factory
  // nativeToken: contractAddresses.wrapped_native_token
  ////////////////////////////

  // dirty hack to circumvent duplicate nonce submission error
  var txCount = await ethers.provider.getTransactionCount(deployer.address);
  async function confirmTransactionCount() {
    await delay(5000);
    let newTxCount;
    while (true) {
      try {
        newTxCount = await ethers.provider.getTransactionCount(
          deployer.address
        );
        if (newTxCount != txCount + 1) {
          continue;
        }
        txCount++;
      } catch (err) {
        console.log(err);
        process.exit(0);
      }
      break;
    }
  }

  async function deploy(factory, args) {
    if (isDeployingActive) {
      await delay(5000);
      var ContractFactory = await ethers.getContractFactory(factory);
      var contract = await ContractFactory.deploy(...args);
      await contract.deployed();
      await confirmTransactionCount();
      console.log(contract.address, ":", factory);
      return contract;
    } else {
      console.log("Deploying is deactivated. Skipping...");
    }
  }

  // REQUIRED CONTRACT DEFINITION
  const vesterAllocationContract = await ethers.getContractAt(
    "TreasuryVester",
    contractAddresses.treasury_vester
  );

  const timelockAddress = await vesterAllocationContract.owner();
  const timelockContract = await ethers.getContractAt(
    "Timelock",
    timelockAddress
  );

  // ;
  const multisigAddress = await timelockContract.admin();
  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    multisigAddress
  );

  // DEPLOYING SAR FARM
  const chef = await deploy("PangoChef", [
    contractAddresses.png,
    deployer.address,
    contractAddresses.factory,
    contractAddresses.wrapped_native_token,
  ]);
  const chefFundForwarder = await deploy("RewardFundingForwarder", [
    chef.address,
  ]);

  // DEPLOYING SAR STAKING
  const stakingMetadata = await deploy("TokenMetadata", [
    multisigAddress,
    PNG_SYMBOL,
  ]);
  const staking = await deploy("PangolinStakingPositions", [
    contractAddresses.png,
    deployer.address,
    stakingMetadata.address,
  ]);
  const stakingFundForwarder = await deploy("RewardFundingForwarder", [
    staking.address,
  ]);

  // CHANGING VESTER ALLOCATION. (treasury, multisig, chefFundForwarder)

  // const oldRecipients = await vesterAllocationContract.getRecipients();
  // console.log(`Old recipients: ${oldRecipients}`);

  let vesterAllocations = [];
  for (let i = 0; i < VESTER_ALLOCATIONS.length; i++) {
    let recipientAddress;
    let isMiniChef;
    if (VESTER_ALLOCATIONS[i].recipient == "treasury") {
      recipientAddress = contractAddresses.community_treasury;
      isMiniChef = false;
    } else if (VESTER_ALLOCATIONS[i].recipient == "multisig") {
      recipientAddress = multisigAddress;
      isMiniChef = false;
    } else if (VESTER_ALLOCATIONS[i].recipient == "chef") {
      recipientAddress = chefFundForwarder.address;
      isMiniChef = true;
    }

    vesterAllocations.push([
      recipientAddress,
      VESTER_ALLOCATIONS[i].allocation,
      isMiniChef,
    ]);
  }

  // CHANGING FEE COLLECTOR'S REWARD CONTRACT TO STAKING
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
