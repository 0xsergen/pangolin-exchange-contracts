const { ethers } = require("hardhat");

const MULTISIG = {
  owners: [
    "0x0E6cE16Ac383F1890eD03c29e528941b74bf7675",
    "0x72C397908Cb93d1B569BBB0Ff8d3D26B7b21d730",
  ],
  threshold: 1,
};

let contracts = [];

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

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

  // deploy function
  async function deploy(factory, args) {
    await delay(5000);
    var ContractFactory = await ethers.getContractFactory(factory);
    var contract = await ContractFactory.deploy(...args);
    await contract.deployed();
    // contracts.push({ name: factory, address: contract.address, args: args });
    contracts.push({ name: factory, address: contract.address, ...args });
    await confirmTransactionCount();
    console.log(contract.address, ":", factory);
    return contract;
  }

  // multisig deployment

  // await deploy("MultiSigWalletWithDailyLimit", [
  //   MULTISIG.owners,
  //   MULTISIG.threshold,
  //   0, // daily Limit
  // ]);

  await deploy("MultiSigWalletWithDailyLimit", [
    MULTISIG.owners,
    MULTISIG.threshold,
    0, // daily Limit
  ]);
  //   console.log(multisig.getOwners());

  console.log(contracts);
  //   console.table(JSON.stringify(contracts));
  //   console.table(contracts);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
