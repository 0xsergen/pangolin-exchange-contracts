const { ethers } = require("hardhat");
const fs = require("fs");
const { FOUNDATION_MULTISIG } = require("../constants/shared.js");
const {
  USE_GNOSIS_SAFE,
  WRAPPED_NATIVE_TOKEN,
  TIMELOCK_DELAY,
} = require(`../constants/${network.name}.js`);
if (USE_GNOSIS_SAFE) {
  var { EthersAdapter, SafeFactory } = require("@gnosis.pm/safe-core-sdk");
}

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

var contracts = [];

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  const initBalance = await deployer.getBalance();
  console.log("Balance:", ethers.utils.formatEther(initBalance) + "\n");

  const pangolinPairFactory = await ethers.getContractFactory("PangolinPair");
  const pangolinPairInitHash = ethers.utils.keccak256(
    pangolinPairFactory.bytecode
  );

  if (USE_GNOSIS_SAFE) {
    console.log("✅ Using Gnosis Safe.");
  } else {
    console.log("⚠️  Using legacy multisig.");
  }
  if (WRAPPED_NATIVE_TOKEN === undefined || WRAPPED_NATIVE_TOKEN == "") {
    console.log("⚠️  No wrapped gas token is defined.");
  } else {
    console.log("✅ An existing wrapped gas token is defined.");
  }

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
    await delay(5000);
    var ContractFactory = await ethers.getContractFactory(factory);
    var contract = await ContractFactory.deploy(...args);
    await contract.deployed();
    contracts.push({ address: contract.address, args: args });
    await confirmTransactionCount();
    console.log(contract.address, ":", factory);
    return contract;
  }

  console.log("\n============\n DEPLOYMENT \n============");

  // Deploy WAVAX if not defined
  if (WRAPPED_NATIVE_TOKEN === undefined) {
    var nativeToken = (await deploy("WAVAX", [])).address;
  } else {
    var nativeToken = WRAPPED_NATIVE_TOKEN;
    console.log(nativeToken, ": WAVAX");
  }

  /**************
   * GOVERNANCE *
   **************/

  // Deploy foundation multisig
  if (USE_GNOSIS_SAFE) {
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: deployer,
    });
    var Multisig = await SafeFactory.create({ ethAdapter });
    var foundation = await Multisig.deploySafe(FOUNDATION_MULTISIG);
    await confirmTransactionCount();
    foundation.address = foundation.getAddress();
    console.log(foundation.address, ": Gnosis");
  } else {
    var foundation = await deploy("MultiSigWalletWithDailyLimit", [
      FOUNDATION_MULTISIG.owners,
      FOUNDATION_MULTISIG.threshold,
      0,
    ]);
  }

  const timelock = await deploy("Timelock", [
    foundation.address,
    TIMELOCK_DELAY,
  ]);
  const factory = await deploy("PangolinFactory", [deployer.address]);
  await deploy("PangolinRouter", [factory.address, nativeToken]);
  await deploy("Multicall2", []);

  console.log("\n===============\n CONFIGURATION \n===============");

  await factory.setFeeToSetter(foundation.address);
  await confirmTransactionCount();
  console.log("Transferred PangolinFactory ownership to Multisig.");

  const endBalance = await deployer.getBalance();
  console.log(
    "\nDeploy cost:",
    ethers.utils.formatEther(initBalance.sub(endBalance)) + "\n"
  );
  console.log(
    "Recorded contract addresses to `addresses/" + network.name + ".js`."
  );
  console.log("Refer to `addresses/README.md` for Etherscan verification.\n");

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
