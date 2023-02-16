const { ethers } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");
const ABI = require("../abi/abi.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  ////////////////////////////
  // CHANGE THESE VARIABLES //
  ////////////////////////////
  const chainInfo = CHAINS[ChainId.SONGBIRD];
  const contractAddresses = chainInfo.contracts;
  let txId = 66;
  ////////////////////////////

  // REQUIRED CONTRACT DEFINITION
  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    contractAddresses.local_multisig
  );

  await multisigContract.executeTransaction(txId, { gasLimit: 2000000 });
  console.log(`Tx is executed. TxId is ${txId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
