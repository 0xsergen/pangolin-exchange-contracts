const { ethers } = require("hardhat");
const { CHAINS, ChainId } = require("@pangolindex/sdk");
const { VESTER_ALLOCATIONS } = require(`../../constants/${network.name}.js`);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  let multiTxs = []; // used for storing target and calldata

  ////////////////////////////
  // CHANGE THESE VARIABLES //
  ////////////////////////////
  const contractAddresses = CHAINS[ChainId.FUJI].contracts;
  const errorCheckActive = false;
  const chefFundForwarder = {
    address: "0x0000000000000000000000000000000000000000",
  }; // GET CHEF FUND FORWARDER ADDRESS FROM SDK, THIS IS JUST FOR NOT GETTING ERROR WHILE DEPLOYMENT
  const staking = {
    address: "0x0000000000000000000000000000000000000000",
  };
  ////////////////////////////

  // REQUIRED CONTRACT DEFINITION

  // Check if chef contract is PangoChef.
  if (errorCheckActive && contractAddresses.mini_chef.type != "PANGO_CHEF")
    throw Error("Chef contract is not PangoChef type.");

  const pangoChefContract = await ethers.getContractAt(
    "PangoChef",
    contractAddresses.mini_chef.address
  );

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

  ////////////////////////////
  // CHANGING VESTER ALLOCATION. (treasury, multisig, chefFundForwarder)
  ////////////////////////////

  // QUEUE TRANSACTION TO TIMELOCK
  let oldRecipients = await treasuryVesterContract.getRecipients();
  console.log("OLD RECIPIENTS OF VESTER ALLOCATION");
  console.table(oldRecipients);

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

  console.log("NEW RECIPIENTS OF VESTER ALLOCATION");
  console.table(vesterAllocations);

  // tx data for setRecipients of vesterAllocation
  const vesterTxEncode = treasuryVesterContract.interface.encodeFunctionData(
    "setRecipients",
    [vesterAllocations]
  );

  // timestamp
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const timestampBefore = blockBefore.timestamp;

  const delayTime = await timelockContract.delay();
  const timestamp = timestampBefore + delayTime.toNumber() + 10 * 60 * 60; // 10h margin

  const timelockTxData = {
    target: contractAddresses.treasury_vester,
    value: 0,
    signature: "setRecipients((address,uint256,bool)[])", // 77b872a8
    data: vesterTxEncode.slice(0, 2) + vesterTxEncode.slice(10), // to exclude signature hash (8byte) from data
    timestamp: timestamp,
  };

  // tx data to be embedded in multisig call to trigger timelock for queuing transaction.
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

  // tx data to send queueTransaction of timelock contract to multisig.
  let multisigTxData = {
    destination: contractAddresses.timelock,
    value: 0,
    data: timelockTxEncode,
  };

  // add target and calldata to the array
  multiTxs.push({
    targetName: "Timelock",
    target: multisigTxData.destination,
    function: "queueTransaction",
    value: multisigTxData.value,
    calldata: multisigTxData.data,
  });

  // CHANGING FEE COLLECTOR'S REWARD CONTRACT TO STAKING
  const hasRole = await feeCollectorContract.hasRole(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    multisigAddress
  );

  if (errorCheckActive && !hasRole) {
    Throw(Error("Multisig address is NOT owner of the FeeCollector contract."));
  }

  oldRecipients = await feeCollectorContract.stakingRewards();
  console.log("OLD RECIPIENT OF FEE COLLECTOR");
  console.table(oldRecipients);

  // tx data to set reward contract on FeeCollector via multisig
  const feeCollectorTxEncode =
    feeCollectorContract.interface.encodeFunctionData("setRewardsContract", [
      staking.address,
    ]);

  multisigTxData = {
    destination: contractAddresses.fee_collector,
    value: 0,
    data: feeCollectorTxEncode,
  };

  // add target and calldata to the array
  multiTxs.push({
    targetName: "FeeCollector",
    target: multisigTxData.destination,
    function: "setRewardsContract",
    value: multisigTxData.value,
    calldata: multisigTxData.data,
  });

  console.log("NEW RECIPIENT OF FEE COLLECTOR");
  console.table(staking.address);

  // EXECUTING TRANSACTION AFTER TIME PASS

  // tx data to be embedded in multisig call to trigger timelock for executing transaction.
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

  // to send executeTransaction of timelock contract to multisig
  multisigTxData = {
    destination: contractAddresses.timelock,
    value: 0,
    data: timelockTxEncode,
  };

  // add target and calldata to the array
  multiTxs.push({
    targetName: "Timelock",
    target: multisigTxData.destination,
    function: "executeTransaction",
    value: multisigTxData.value,
    calldata: multisigTxData.data,
  });

  let count = 0;
  for (let tx of multiTxs) {
    count++;
    console.log("--------------------------------------");
    console.log(`TX${count} to send Multisig contract`);
    console.log(tx);
  }

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

  // const impersonatedAccount = provider.getSigner(timelockAddress);
  // const impersonatedAccountMulti = provider.getSigner(multisigAddress);
  // const multi1Account = provider.getSigner(account1);
  // const multi2Account = provider.getSigner(account2);

  // const treasuryVesterImpersonated =
  //   treasuryVesterContract.connect(impersonatedAccount);

  // const feeCollectorImpersonated = feeCollectorContract.connect(
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

  // let timelockTx = await treasuryVesterImpersonated.setRecipients(
  //   vesterAllocations
  // );

  // timelockTx.wait();
  // let recipients = await treasuryVesterImpersonated.getRecipients();
  // console.log("New recipients...");
  // console.log(recipients);

  // console.log(timelockTxData);

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
