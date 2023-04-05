const { utils, Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { ethers } = require("hardhat");
const fs = require("fs");
const { FOUNDATION_MULTISIG } = require("../constants/shared.js");
const {
  USE_GNOSIS_SAFE,
  WRAPPED_NATIVE_TOKEN,
  TIMELOCK_DELAY,
} = require(`../constants/${network.name}.js`);
require("dotenv").config();
require("hardhat/types"); // hre
if (USE_GNOSIS_SAFE) {
  var { EthersAdapter, SafeFactory } = require("@gnosis.pm/safe-core-sdk");
}

const isZksync = network.zksync === true;

var contracts = [];

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  var zksyncWallet;
  var zksyncDeployer;
  if (isZksync) {
    zksyncWallet = new Wallet(process.env.PRIVATE_KEY);
    zksyncDeployer = new Deployer(hre, zksyncWallet);
  }

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
    var contract;
    if (isZksync) {
      var artifact = await zksyncDeployer.loadArtifact(factory);
      contract = await zksyncDeployer.deploy(artifact, args);
    } else {
      var ContractFactory = await ethers.getContractFactory(factory);
      contract = await ContractFactory.deploy(...args);
      await contract.deployed();
    }
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

  // Deploy Multicall
  const multicall = await deploy("Multicall2", []);

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
    var foundation = await deploy("MultiSigWallet", [
      FOUNDATION_MULTISIG.owners,
      FOUNDATION_MULTISIG.threshold,
    ]);
  }

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
