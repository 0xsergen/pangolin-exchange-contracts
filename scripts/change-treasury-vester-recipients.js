const { ethers } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");
const {
  PNG_SYMBOL,
  PNG_NAME,
  TOTAL_SUPPLY,
  USE_GNOSIS_SAFE,
  WRAPPED_NATIVE_TOKEN,
  INITIAL_MINT,
  AIRDROP_AMOUNT,
  AIRDROP_MERKLE_ROOT,
  VESTER_ALLOCATIONS,
  REVENUE_DISTRIBUTION,
  START_VESTING,
  LINEAR_VESTING,
  VESTING_COUNT,
  TIMELOCK_DELAY,
  WETH_PNG_FARM_ALLOCATION,
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
  const isImpersonatingActive = true;
  const contractAddresses = CHAINS[ChainId.COSTON2].contracts;
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
  const treasuryVesterContract = await ethers.getContractAt(
    "TreasuryVesterLinear",
    contractAddresses.treasury_vester
  );

  const timelockAddress = await treasuryVesterContract.owner();
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

  const chef = await ethers.getContractAt(
    "PangoChef",
    contractAddresses.mini_chef.address
  );

  const chefFundForwarder = await ethers.getContractAt(
    "RewardFundingForwarder",
    "0xa680eF5C3fB2C1D6ad69Fc60A883b3A74D599906"
  );

  // Checking of chefFundForwarder
  if ((await chefFundForwarder.pangoChef()) != chef.address) {
    throw "ChefFundForwarder belongs to another pangoChef.";
  }

  // CHANGING VESTER ALLOCATION. ([0] -> treasury, [1] -> multisig, [2] -> chefFundForwarder)
  const oldChefFundForwarder = (await treasuryVesterContract.recipients(2))
    .account;
  console.log(`Old recipient for chefFundForwarder: ${oldChefFundForwarder}`);

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

  console.log("New recipients");
  console.log(vesterAllocations);

  const vesterTxEncode = treasuryVesterContract.interface.encodeFunctionData(
    "setRecipients",
    [vesterAllocations]
  );

  // getting timestamp
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const timestampBefore = blockBefore.timestamp;

  const delayTime = await timelockContract.delay();

  const timestamp = timestampBefore + delayTime.toNumber() + 10 * 60 * 60; // 10h

  const timelockTxData = {
    target: contractAddresses.treasury_vester,
    value: 0,
    signature: "setRecipients((address,uint256,bool)[])", // 77b872a8
    data: vesterTxEncode.slice(0, 2) + vesterTxEncode.slice(10), // to exclude signature hash (8byte) from data
    timestamp: timestamp,
  };

  console.log(
    "Timelock data that is used for queing and submitting transaction"
  );
  console.log(timelockTxData);

  // it is the transaction data to be embedded in multisig call to trigger timelock for queuing transaction.
  let timelockTxEncode = timelockContract.interface.encodeFunctionData(
    "queueTransaction",
    [
      timelockTxData.target,
      timelockTxData.value,
      timelockTxData.signature,
      timelockTxData.data,
      timelockTxData.timestamp,
    ]
  );

  // it is the transaction data to send queueTransaction of timelock contract.
  let multisigTxData = {
    destination: contractAddresses.timelock,
    value: 0,
    data: timelockTxEncode,
  };

  console.log("Sending queueTransaction to timelock via multisig.");
  let transactionId = await multisigContract.transactionCount();
  console.log(`Tx count output before submitting tx is: ${transactionId}`);

  // submit transaction to multisig to queue transaction on timelock.
  await multisigContract.submitTransaction(
    multisigTxData.destination,
    multisigTxData.value,
    multisigTxData.data
  );

  console.log(`Tx${transactionId} is submitted.`);

  console.log("Sending executeTransaction to timelock via multisig.");
  // it is the transaction data to be embedded in multisig call to trigger timelock for executing transaction.
  timelockTxEncode = timelockContract.interface.encodeFunctionData(
    "executeTransaction",
    [
      timelockTxData.target,
      timelockTxData.value,
      timelockTxData.signature,
      timelockTxData.data,
      timelockTxData.timestamp,
    ]
  );

  multisigTxData = {
    destination: contractAddresses.timelock,
    value: 0,
    data: timelockTxEncode,
  }; // to send queueTransaction of timelock contract.

  transactionId = await multisigContract.transactionCount();
  console.log(`Tx count output before submitting tx is: ${transactionId}`);

  // submit transaction to multisig to execute transaction on timelock.
  await multisigContract.submitTransaction(
    multisigTxData.destination,
    multisigTxData.value,
    multisigTxData.data
  );

  console.log(`Tx${transactionId} is submitted.`);

  /***************************
   * IMPERSONATING TIMELOCK *
   ***************************/
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://localhost:8545"
  // );
  // await provider.send("hardhat_impersonateAccount", [timelockAddress]);
  // await provider.send("hardhat_impersonateAccount", [multisigAddress]);
  // const account1 = "0x72c397908cb93d1b569bbb0ff8d3d26b7b21d730";
  // const account2 = "0xda315a838e918026e51a864c43766f5ae86be8c6";

  // await provider.send("hardhat_impersonateAccount", [account1]);
  // await provider.send("hardhat_impersonateAccount", [account2]);

  // // const impersonatedAccount = provider.getSigner(timelockAddress);
  // const impersonatedAccountMulti = provider.getSigner(multisigAddress);
  // const multi1Account = provider.getSigner(account1);
  // const multi2Account = provider.getSigner(account2);

  // const treasuryVesterImpersonated =
  //   treasuryVesterContract.connect(impersonatedAccount);

  // const timelockContractImpersonated = timelockContract.connect(
  //   impersonatedAccountMulti
  // );
  // const multisigContractImpersonatedP1 =
  //   multisigContract.connect(multi1Account);

  // const multisigContractImpersonatedP2 =
  //   multisigContract.connect(multi2Account);

  // await deployer.sendTransaction({
  //   to: timelockAddress,
  //   value: ethers.utils.parseEther("0.4"),
  // });

  // await deployer.sendTransaction({
  //   to: multisigAddress,
  //   value: ethers.utils.parseEther("0.4"),
  // });

  // await deployer.sendTransaction({
  //   to: account1,
  //   value: ethers.utils.parseEther("0.4"),
  // });

  // await deployer.sendTransaction({
  //   to: account2,
  //   value: ethers.utils.parseEther("0.4"),
  // });

  // // getting timestamp
  // const blockNumBefore = await ethers.provider.getBlockNumber();
  // const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  // const timestampBefore = blockBefore.timestamp;

  // const delayTime = await timelockContract.delay();
  // // console.log(delayTime.toNumber());
  // const timestamp = timestampBefore + delayTime.toNumber() + 1 * 60 * 60; // 1h

  // const timelockTxData = {
  //   target: contractAddresses.treasury_vester,
  //   value: 0,
  //   signature: "setRecipients((address,uint256,bool)[])", // 77b872a8
  //   data: vesterTxEncode.slice(0, 2) + vesterTxEncode.slice(10), // to exclude signature hash (8byte) from data
  //   timestamp: timestamp,
  // };

  // let tx = await timelockContractImpersonated.queueTransaction(
  //   timelockTxData.target,
  //   timelockTxData.value,
  //   timelockTxData.signature,
  //   timelockTxData.data,
  //   timelockTxData.timestamp
  // );
  // tx.wait();
  // console.log(tx);
  // let timelockTxEncode = timelockContract.interface.encodeFunctionData(
  //   "queueTransaction",
  //   [
  //     timelockTxData.target,
  //     timelockTxData.value,
  //     timelockTxData.signature,
  //     timelockTxData.data,
  //     timelockTxData.timestamp,
  //   ]
  // ); // it is the transaction data to be embedded in multisig call to trigger timelock for queuing transaction.

  // let multisigTxData = {
  //   destination: contractAddresses.timelock,
  //   value: 0,
  //   data: timelockTxEncode,
  // }; // to send queueTransaction of timelock contract.

  // console.log("Sending queueTransaction to timelock via multisig.");
  // let transactionId = await multisigContract.transactionCount();
  // console.log(`Tx count output before submitting tx is: ${transactionId}`);

  // // the wallet isn't in owners yet. so used impersonated one.
  // await multisigContractImpersonatedP1.submitTransaction(
  //   multisigTxData.destination,
  //   multisigTxData.value,
  //   multisigTxData.data
  // );

  // console.log(`Tx${transactionId} is submitted.`);
  // await multisigContractImpersonatedP2.confirmTransaction(transactionId, {
  //   gasLimit: 2000000,
  // });
  // console.log("Confirmed by P2.");

  // // console.log("Addresses that confirmed the tx.");
  // // console.log(await multisigContract.getConfirmations(transactionId));
  // console.log(
  //   `Confirmation for Tx${transactionId}: ${await multisigContract.getConfirmationCount(
  //     transactionId
  //   )}`
  // );

  // let isConfirmed = await multisigContract.isConfirmed(transactionId);
  // let isExecuted = (await multisigContract.transactions(transactionId))
  //   .executed;
  // console.log(isConfirmed ? "Tx is confirmed." : "Tx is not confirmed");
  // console.log(
  //   isExecuted ? "Tx is executed successfully." : "Execution failed."
  // );

  // /*******************************************
  //  * INCREASING TIME TO CONFIRM TIMELOCK TX *
  //  *******************************************/

  // await provider.send("evm_increaseTime", [432000]);
  // await provider.send("evm_mine"); // 432000 seconds later
  // console.log("Time is forwarded to pass timelock waiting period.");

  // // let recipients = await treasuryVester.getRecipients();
  // // console.log("Existing recipients...");
  // // console.log(recipients);

  // // await timelockContractImpersonated.executeTransaction(
  // //   timelockTxData.target,
  // //   timelockTxData.value,
  // //   timelockTxData.signature,
  // //   timelockTxData.data,
  // //   timelockTxData.timestamp
  // // );

  // console.log("Sending executeTransaction to timelock via multisig.");
  // timelockTxEncode = timelockContract.interface.encodeFunctionData(
  //   "executeTransaction",
  //   [
  //     timelockTxData.target,
  //     timelockTxData.value,
  //     timelockTxData.signature,
  //     timelockTxData.data,
  //     timelockTxData.timestamp,
  //   ]
  // ); // it is the transaction data to be embedded in multisig call to trigger timelock for queuing transaction.

  // multisigTxData = {
  //   destination: contractAddresses.timelock,
  //   value: 0,
  //   data: timelockTxEncode,
  // }; // to send queueTransaction of timelock contract.

  // transactionId = await multisigContract.transactionCount();
  // console.log(`Tx count output before submitting tx is: ${transactionId}`);

  // // the wallet isn't in owners yet. so used impersonated one.
  // await multisigContractImpersonatedP1.submitTransaction(
  //   multisigTxData.destination,
  //   multisigTxData.value,
  //   multisigTxData.data
  // );

  // recipients = await treasuryVesterContract.getRecipients();
  // console.log("Old MiniChef address for TreasuryVester...");
  // console.log(recipients.slice(-1)[0].account);

  // console.log(`Tx${transactionId} is submitted.`);
  // await multisigContractImpersonatedP2.confirmTransaction(transactionId, {
  //   gasLimit: 2000000,
  // });
  // console.log("Confirmed by P2.");

  // // console.log("Addresses that confirmed the tx.");
  // // console.log(await multisigContract.getConfirmations(transactionId));
  // console.log(
  //   `Confirmation for Tx${transactionId}: ${await multisigContract.getConfirmationCount(
  //     transactionId
  //   )}`
  // );

  // isConfirmed = await multisigContract.isConfirmed(transactionId);
  // isExecuted = (await multisigContract.transactions(transactionId)).executed;
  // console.log(isConfirmed ? "Tx is confirmed." : "Tx is not confirmed");
  // console.log(
  //   isExecuted ? "Tx is executed successfully." : "Execution failed."
  // );

  // recipients = await treasuryVesterContract.getRecipients();
  // console.log("New MiniChef address for TreasuryVester...");
  // console.log(recipients.slice(-1)[0].account);

  // //////

  // // CHANGING FEE COLLECTOR'S REWARD CONTRACT TO STAKING
  // let hasRole = await feeCollectorContract.hasRole(
  //   "0x0000000000000000000000000000000000000000000000000000000000000000",
  //   multisigAddress
  // );

  // console.log(
  //   hasRole
  //     ? "Multisig has DEFAULT_ADMIN_ROLE"
  //     : "Multisig doesn't have DEFAULT_ADMIN_ROLE"
  // );

  // console.log("Sending setRewardsContract to feeCollector via multisig.");
  // const feeCollectorTxEncode =
  //   feeCollectorContract.interface.encodeFunctionData("setRewardsContract", [
  //     staking.address,
  //   ]);

  // multisigTxData = {
  //   destination: contractAddresses.fee_collector,
  //   value: 0,
  //   data: feeCollectorTxEncode,
  // }; // to send queueTransaction of timelock contract.

  // transactionId = await multisigContract.transactionCount();
  // console.log(`Tx count output before submitting tx is: ${transactionId}`);

  // console.log(
  //   `Old reward contract: ${await feeCollectorContract.stakingRewards()}`
  // );

  // // the wallet isn't in owners yet. so used impersonated one.
  // await multisigContractImpersonatedP1.submitTransaction(
  //   multisigTxData.destination,
  //   multisigTxData.value,
  //   multisigTxData.data
  // );

  // console.log(`Tx${transactionId} is submitted.`);
  // await multisigContractImpersonatedP2.confirmTransaction(transactionId, {
  //   gasLimit: 2000000,
  // });
  // console.log("Confirmed by P2.");

  // // console.log("Addresses that confirmed the tx.");
  // // console.log(await multisigContract.getConfirmations(transactionId));
  // console.log(
  //   `Confirmation for Tx${transactionId}: ${await multisigContract.getConfirmationCount(
  //     transactionId
  //   )}`
  // );

  // isConfirmed = await multisigContract.isConfirmed(transactionId);
  // isExecuted = (await multisigContract.transactions(transactionId)).executed;
  // console.log(isConfirmed ? "Tx is confirmed." : "Tx is not confirmed");
  // console.log(
  //   isExecuted ? "Tx is executed successfully." : "Execution failed."
  // );

  // console.log(
  //   `New reward contract: ${await feeCollectorContract.stakingRewards()}`
  // );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
