const { ethers } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");
const {
  PNG_SYMBOL,
  PNG_NAME,
  WRAPPED_NATIVE_TOKEN,
  VESTER_ALLOCATIONS,
  REVENUE_DISTRIBUTION,
  WETH_PNG_FARM_ALLOCATION,
} = require(`../constants/${network.name}.js`);

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
  const contractAddresses = CHAINS[ChainId.FUJI].contracts;
  // png: contractAddresses.png
  // factory: contractAddresses.factory
  // nativeToken: contractAddresses.wrapped_native_token
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
    "TreasuryVester",
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

  const feeCollectorContract = await ethers.getContractAt(
    "FeeCollector",
    contractAddresses.fee_collector
  );

  // DEPLOYING SAR FARM
  // const chef = await deploy("PangoChef", [
  //   contractAddresses.png,
  //   deployer.address,
  //   contractAddresses.factory,
  //   contractAddresses.wrapped_native_token,
  // ]);

  const chef = await ethers.getContractAt(
    "PangoChef",
    "0x3D96DD45deae7491A294252E22E8F640Ce527dbe"
  );

  // const chefFundForwarder = await deploy("RewardFundingForwarder", [
  //   chef.address,
  // ]);

  const chefFundForwarder = await ethers.getContractAt(
    "RewardFundingForwarder",
    "0x069731B89060351874689325aA6d12575972A694"
  );

  // DEPLOYING SAR STAKING
  // const stakingMetadata = await deploy("TokenMetadata", [
  //   multisigAddress,
  //   PNG_SYMBOL,
  // ]);

  const stakingMetadata = await ethers.getContractAt(
    "TokenMetadata",
    "0xDd1a0e81496bB29fE8f8917ff1a8A50b45194ac2"
  );

  // const staking = await deploy("PangolinStakingPositions", [
  //   contractAddresses.png,
  //   deployer.address,
  //   stakingMetadata.address,
  // ]);

  const staking = await ethers.getContractAt(
    "PangolinStakingPositions",
    "0xBA1445F5208D6E17146d2D58e37916c583C26B9f"
  );
  // const stakingFundForwarder = await deploy("RewardFundingForwarder", [
  //   staking.address,
  // ]);

  const stakingFundForwarder = await ethers.getContractAt(
    "RewardFundingForwarder",
    "0xb52Fa2153F2cFD02CFF545c55479f3D5cd73292e"
  );

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
  console.log("Added TreasuryVester as PangoChef funder.");

  await chef.setWeights(["0"], [WETH_PNG_FARM_ALLOCATION]);
  await confirmTransactionCount();
  console.log("Gave 30x weight to PNG-NATIVE_TOKEN");

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
  console.log("Added FeeCollector as PangolinStakingPosition funder.");

  await staking.renounceRole(FUNDER_ROLE, deployer.address);
  await confirmTransactionCount();
  await staking.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address);
  await confirmTransactionCount();
  console.log("Transferred PangolinStakingPositions ownership to Multisig.");

  // CHANGING VESTER ALLOCATION. (treasury, multisig, chefFundForwarder)

  // const oldRecipients = await vesterAllocationContract.getRecipients();
  // console.log(`Old recipients: ${oldRecipients}`);

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

  const vesterTxEncode = treasuryVesterContract.interface.encodeFunctionData(
    "setRecipients",
    [vesterAllocations]
  );

  /***************************
   * IMPERSONATING TIMELOCK *
   ***************************/
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://localhost:8545"
  // );
  // // await provider.send("hardhat_impersonateAccount", [timelockAddress]);
  // // await provider.send("hardhat_impersonateAccount", [multisigAddress]);
  // const account1 = "0x72c397908cb93d1b569bbb0ff8d3d26b7b21d730";
  // const account2 = "0xda315a838e918026e51a864c43766f5ae86be8c6";

  // await provider.send("hardhat_impersonateAccount", [account1]);
  // await provider.send("hardhat_impersonateAccount", [account2]);

  // // const impersonatedAccount = provider.getSigner(timelockAddress);
  // // const impersonatedAccountMulti = provider.getSigner(multisigAddress);
  // const multi1Account = provider.getSigner(account1);
  // const multi2Account = provider.getSigner(account2);

  // // const treasuryVesterImpersonated =
  // //   treasuryVesterContract.connect(impersonatedAccount);

  // // const feeCollectorImpersonated = feeCollectorContract.connect(
  // //   impersonatedAccountMulti
  // // );
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

  // getting timestamp
  // const blockNumBefore = await ethers.provider.getBlockNumber();
  // const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  // const timestampBefore = blockBefore.timestamp;

  // const delayTime = await timelockContract.delay();
  // // console.log(delayTime.toNumber());
  // const timestamp = timestampBefore + delayTime.toNumber() + 10 * 60 * 60; // 10h

  // const timelockTxData = {
  //   target: contractAddresses.treasury_vester,
  //   value: 0,
  //   signature: "setRecipients((address,uint256,bool)[])", // 77b872a8
  //   data: vesterTxEncode.slice(0, 2) + vesterTxEncode.slice(10), // to exclude signature hash (8byte) from data
  //   timestamp: timestamp,
  // };
  // // console.log(timelockTxData);

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
