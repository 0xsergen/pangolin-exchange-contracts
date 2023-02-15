const { ethers } = require("hardhat");
const { CHAINS, ChainId } = require("@pangolindex/sdk");
const {
  PNG_SYMBOL,
  WETH_PNG_FARM_ALLOCATION,
} = require(`../../constants/${network.name}.js`);

const FUNDER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("FUNDER_ROLE")
);
const MINTER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("MINTER_ROLE")
);
const POOL_MANAGER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("POOL_MANAGER_ROLE")
);
const HARVEST_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("HARVEST_ROLE")
);
const PAUSE_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("PAUSE_ROLE")
);
const RECOVERY_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("RECOVERY_ROLE")
);
const GOVERNOR_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("GOVERNOR_ROLE")
);
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

let contracts = [];

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
  ////////////////////////////

  // dirty hack to circumvent duplicate nonce submission error
  let txCount = await ethers.provider.getTransactionCount(deployer.address);
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
      contracts.push({ address: contract.address, factory: factory });
      console.log(contract.address, ":", factory);
      return contract;
    } else {
      console.log("Deploying is deactivated. Skipping...");
    }
  }

  // REQUIRED CONTRACT DEFINITION
  const treasuryVesterContract = await ethers.getContractAt(
    "TreasuryVester",
    contractAddresses.treasury_vester
  );

  const timelockAddress = await treasuryVesterContract.owner();
  const timelockContract = await ethers.getContractAt(
    "Timelock",
    timelockAddress
  );

  const multisigAddress = await timelockContract.admin();
  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    multisigAddress
  );

  const feeCollectorContract = await ethers.getContractAt(
    "FeeCollector",
    contractAddresses.fee_collector
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

  console.log("\n===============\n CONFIGURATION \n===============");

  /*******************
   * PANGOCHEF ROLES *
   *******************/

  await chef.grantRole(FUNDER_ROLE, contractAddresses.treasury_vester);
  await confirmTransactionCount();
  await chef.grantRole(FUNDER_ROLE, chefFundForwarder.address);
  await confirmTransactionCount();
  await chef.grantRole(FUNDER_ROLE, multisigAddress);
  await confirmTransactionCount();
  await chef.grantRole(POOL_MANAGER_ROLE, multisigAddress);
  await confirmTransactionCount();
  await chef.grantRole(DEFAULT_ADMIN_ROLE, multisigAddress);
  await confirmTransactionCount();
  console.log(
    "Added TreasuryVester and PangoChefFundForwarder as PangoChef funder."
  );

  await chef.setWeights(["0"], [WETH_PNG_FARM_ALLOCATION]);
  await confirmTransactionCount();
  console.log(
    `Gave ${WETH_PNG_FARM_ALLOCATION / 100}x weight to PNG-NATIVE_TOKEN`
  );

  await chef.renounceRole(FUNDER_ROLE, deployer.address);
  await confirmTransactionCount();
  await chef.renounceRole(POOL_MANAGER_ROLE, deployer.address);
  await confirmTransactionCount();
  await chef.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address);
  await confirmTransactionCount();
  console.log("Transferred PangoChef ownership to Multisig.");

  /************************* *
   * STAKING POSITIONS ROLES *
   ************************* */

  await staking.grantRole(FUNDER_ROLE, contractAddresses.fee_collector);
  await confirmTransactionCount();
  await staking.grantRole(FUNDER_ROLE, stakingFundForwarder.address);
  await confirmTransactionCount();
  await staking.grantRole(FUNDER_ROLE, multisigAddress);
  await confirmTransactionCount();
  await staking.grantRole(DEFAULT_ADMIN_ROLE, multisigAddress);
  await confirmTransactionCount();
  console.log(
    "Added FeeCollector and Staking Fund Forwarder as PangolinStakingPosition funder."
  );

  await staking.renounceRole(FUNDER_ROLE, deployer.address);
  await confirmTransactionCount();
  await staking.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address);
  await confirmTransactionCount();
  console.log("Transferred PangolinStakingPositions ownership to Multisig.");

  console.log("Deployed contracts are written to `./" + network.name + ".js`.");

  try {
    fs.writeFileSync(
      "addresses/" + network.name + ".js",
      "exports.ADDRESSES=" + JSON.stringify(contracts)
    );
    //file written successfully
  } catch (err) {
    console.error(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
