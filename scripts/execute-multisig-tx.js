const { ethers } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");
const ABI = require("../abi/abi.json");

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
  const chainInfo = CHAINS[ChainId.SONGBIRD];
  const contractAddresses = chainInfo.contracts;
  const wrappedNativeTokenAddress = contractAddresses.wrapped_native_token;
  ////////////////////////////

  // REQUIRED CONTRACT DEFINITION
  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    contractAddresses.local_multisig
  );

  let txId = 66;
  await multisigContract.executeTransaction(txId, { gasLimit: 2000000 });
  console.log(`Tx is executed. TxId is ${txId}`);

  /***************************
   * IMPERSONATING *
   ***************************/

  /*   const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );

  ACC_1 = "0x372e6c7cd93df13a799a390b7dda7c211aba63b4";
  ACC_2 = "0x72c397908cb93d1b569bbb0ff8d3d26b7b21d730";
  // await provider.send("hardhat_impersonateAccount", [multisigContract.address]);
  await provider.send("hardhat_impersonateAccount", [ACC_1]);
  await provider.send("hardhat_impersonateAccount", [ACC_2]);

  // const impersonatedMulti = provider.getSigner(multisigContract.address);
  const impersonatedACC1 = provider.getSigner(ACC_1);
  const impersonatedACC2 = provider.getSigner(ACC_2);

  let multisigBalance = await wrappedNativeTokenContract.balanceOf(
    multisigContract.address
  );
  console.log(multisigBalance);

  const multiImpersonatedACC1 = multisigContract.connect(impersonatedACC1);

  const multiImpersonatedACC2 = multisigContract.connect(impersonatedACC2);

  multiImpersonatedACC1.confirmTransaction(txId, { gasLimit: 2000000 });
  await delay(5000);
  multiImpersonatedACC2.confirmTransaction(txId, { gasLimit: 2000000 });
  await delay(5000);

  console.log(await multisigContract.transactions(txId));

  multisigBalance = await wrappedNativeTokenContract.balanceOf(
    multisigContract.address
  );
  console.log(multisigBalance); */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
