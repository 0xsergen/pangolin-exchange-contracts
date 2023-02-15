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
  const rewardTokens = [
    {
      address: "0xfd2a0fD402828fDB86F9a9D5a760242AD7526cC0", // SPRK Token
      multiplier: "1", // The amount of each additional reward token to be claimable for every 1 base reward (PNG) being claimed
      fundingAmount: "10000000", // in ether unit
    },
    {
      address: "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED", // WSGB Token
      multiplier: "1", // The amount of each additional reward token to be claimable for every 1 base reward (PNG) being claimed
      fundingAmount: "10000000", // in ether unit
    },
  ];

  // const rewardTokenAddress = "0xfd2a0fD402828fDB86F9a9D5a760242AD7526cC0";
  // const rewardMultipliers = "1"; // The amount of each additional reward token to be claimable for every 1 base reward (PNG) being claimed
  // const rewardFundingAmount = "10000000"; // in ether unit
  const lpAddress = "0x21ABc7e58a62195c7392630376feA5C96E76DDEf"; // CHANGE IT!!!

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

  const rewarderName =
    chainInfo.id == "songbird_canary"
      ? "RewarderViaMultiplierForPangoChefOnSongbird"
      : "RewarderViaMultiplierForPangoChef";

  const rewarderFactory = await ethers.getContractFactory(rewarderName);
  // console.log(rewarderName);

  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    contractAddresses.local_multisig
  );

  // DEPLOYING SUPERFARM

  const pangoChefContract = await ethers.getContractAt(
    "PangoChef",
    contractAddresses.mini_chef.address
  );

  let pglAddress = lpAddress;
  // if (pglAddress == "") throw "LP address is empty!";
  console.log(`PGL Address: ${pglAddress}`);

  const poolId = await pangoChefContract.poolsLength();
  // INITIALIZE POOL TO CREATE A FARM WITHOUT A WEIGHT VIA MULTISIG
  const txBytecode = pangoChefContract.interface.encodeFunctionData(
    "initializePool",
    [pglAddress, "1"]
  );

  let txId = await multisigContract.transactionCount();
  await multisigContract.submitTransaction(
    pangoChefContract.address,
    0,
    txBytecode
  );

  console.log(`Tx for initializing pool is sent to multisig. TxId is ${txId}`);

  // SUPER FARM REWARDER
  const rewardAddressArguments = [];
  const rewardMultiplierArguments = [];
  for (const reward of rewardTokens) {
    rewardAddressArguments.push(reward.address);
    rewardMultiplierArguments.push(ethers.utils.parseEther(reward.multiplier));
  }

  // deploying rewarder. one rewarder for one super farm.
  const superFarmRewarder = await rewarderFactory.deploy(
    rewardAddressArguments,
    rewardMultiplierArguments,
    "18",
    pangoChefContract.address
  );
  await superFarmRewarder.deployed();
  console.log(`Rewarder address: ${superFarmRewarder.address}`);

  // SENDING ADDITIONAL TOKENS TO THE REWARDER VIA MULTISIG
  for (const reward of rewardTokens) {
    const rewardTokenContract = new ethers.Contract(
      reward.address,
      ABI.TOKEN,
      deployer
    );

    const currentRewardBalance = await rewardTokenContract.balanceOf(
      multisigContract.address
    );
    console.log(
      `Current Reward Balance for ${reward.address}: ${currentRewardBalance}`
    );
    if (
      currentRewardBalance.lt(ethers.utils.parseEther(reward.fundingAmount))
    ) {
      throw Error("Reward Balance is less than Funding Amount");
    }

    const fundingTxBytecode = rewardTokenContract.interface.encodeFunctionData(
      "transfer",
      [superFarmRewarder.address, ethers.utils.parseEther(reward.fundingAmount)]
    );

    txId = await multisigContract.transactionCount();
    await multisigContract.submitTransaction(
      rewardTokenContract.address,
      0,
      fundingTxBytecode
    );

    console.log(
      `Tx for sending reward token ${reward.address} to the rewarder is sent to multisig. TxId is ${txId}`
    );
  }

  /***************************
   * IMPERSONATING *
   ***************************/

  /* const provider = new ethers.providers.JsonRpcProvider(
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

  multiImpersonatedACC1.confirmTransaction(txId - 2, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC1.confirmTransaction(txId - 1, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC1.confirmTransaction(txId, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC2.confirmTransaction(txId - 2, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC2.confirmTransaction(txId - 1, { gasLimit: 2000000 });
  await delay(3000);
  multiImpersonatedACC2.confirmTransaction(txId, { gasLimit: 2000000 });

  console.log("Transaction status:");
  console.log(await multisigContract.transactions(txId - 2));
  console.log(await multisigContract.transactions(txId - 1));
  console.log(await multisigContract.transactions(txId));

  console.log("PangoChef Pool status");
  const poolResult = await pangoChefContract.pools(poolId);
  console.log(`tokenOrRecipient for new pool: ${poolResult.tokenOrRecipient}`);

  console.log("Balance status");
  for (const reward of rewardTokens) {
    const rewardTokenContract = new ethers.Contract(
      reward.address,
      ABI.TOKEN,
      deployer
    );

    const currentBalance = await rewardTokenContract.balanceOf(
      multisigContract.address
    );
    console.log(`Multisig Balance for ${reward.address}: ${currentBalance}`);
  } */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
