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
  const chainInfo = CHAINS[ChainId.SONGBIRD];
  const contractAddresses = chainInfo.contracts;
  const pool = {
    pid: 11, // poolId for the pool
    rewarder: "0x0000000000000000000000000000000000000000", // rewarder address
    weight: 100, // weight of it
  };
  //   console.log(contractAddresses);
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

  // REQUIRED CONTRACT DEFINITION
  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    contractAddresses.local_multisig
  );

  const pangoChefContract = await ethers.getContractAt(
    "PangoChef",
    contractAddresses.mini_chef.address
  );

  // SETTING REWARDER
  const txBytecode = pangoChefContract.interface.encodeFunctionData(
    "setRewarder",
    [pool.pid, pool.rewarder]
  );

  let txId = await multisigContract.transactionCount();
  await multisigContract.submitTransaction(
    pangoChefContract.address,
    0,
    txBytecode
  );

  console.log(`Tx for setting rewarder is sent to multisig. TxId: ${txId}`);
  await confirmTransactionCount();

  // SETTING WEIGHTS
  const weightTxBytecode = pangoChefContract.interface.encodeFunctionData(
    "setWeights",
    [[pool.pid], [pool.weight]]
  );

  txId = await multisigContract.transactionCount();
  await multisigContract.submitTransaction(
    pangoChefContract.address,
    0,
    weightTxBytecode
  );

  console.log(`Tx for setting weights is sent to multisig. TxId: ${txId}`);

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

  const multiImpersonatedACC1 = multisigContract.connect(impersonatedACC1);
  const multiImpersonatedACC2 = multisigContract.connect(impersonatedACC2);

  multiImpersonatedACC1.confirmTransaction(txId - 1, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC1.confirmTransaction(txId, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC2.confirmTransaction(txId - 1, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC2.confirmTransaction(txId, { gasLimit: 2000000 });

  console.log("Transaction status:");
  console.log(await multisigContract.transactions(txId - 1));
  console.log(await multisigContract.transactions(txId));

  console.log("PangoChef Pool status");
  console.log(await pangoChefContract.pools(pool.pid)); */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
