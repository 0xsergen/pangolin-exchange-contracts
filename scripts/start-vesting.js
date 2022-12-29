const { ethers } = require("hardhat");
// const CONFIG = require("../../config/config");
// const ABI = require("../../config/abi.json");
// const ADDRESS = require("../../config/address.json");
// const Web3 = require("web3");

// Change These Variables
// ---------------------------------------------------------------
// const web3 = new Web3(
//   new Web3.providers.HttpProvider("https://coston2-api.flare.network/ext/C/rpc")
// );
const multisigAddress = "0x90CE7198211D6B17be9fa5204701F9c9aCe2970b";
const treasuryVesterAddress = "0x6B77Cb69Dae236bC708d75B76356911D2D197601";
// ---------------------------------------------------------------

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  const treasuryVesterContract = await ethers.getContractAt(
    "TreasuryVesterLinear",
    treasuryVesterAddress
  );

  //  TX bytecode
  const txBytecode =
    treasuryVesterContract.interface.encodeFunctionData("startVesting");

  const multisigContract = await ethers.getContractAt(
    "MultiSigWalletWithDailyLimit",
    multisigAddress
  );

  /***************************
   * IMPERSONATING MULTISIG *
   ***************************/
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://localhost:8545"
  // );

  // const multi1 = "0x0000B0907d933104A582B399128502f62a48F3ac";
  // const multi2 = "0x72C397908Cb93d1B569BBB0Ff8d3D26B7b21d730";
  // await provider.send("hardhat_impersonateAccount", [multisigAddress]);
  // await provider.send("hardhat_impersonateAccount", [multi1]);
  // await provider.send("hardhat_impersonateAccount", [multi2]);
  // const impersonatedAccount = provider.getSigner(multisigAddress);
  // const multi1Account = provider.getSigner(multi1);
  // const multi2Account = provider.getSigner(multi2);

  // const routerContractImpersonatedMultisig =
  //   treasuryVesterContract.connect(impersonatedAccount);

  // const multisigContractImpersonatedP1 =
  //   multisigContract.connect(multi1Account);

  // const multisigContractImpersonatedP2 =
  //   multisigContract.connect(multi2Account);

  // await deployer.sendTransaction({
  //   to: multisigAddress,
  //   value: ethers.utils.parseEther("0.1"),
  // });

  // await deployer.sendTransaction({
  //   to: multi1,
  //   value: ethers.utils.parseEther("0.1"),
  // });

  // await deployer.sendTransaction({
  //   to: multi2,
  //   value: ethers.utils.parseEther("0.1"),
  // });

  let transactionId = await multisigContract.transactionCount();
  console.log(
    `transactionCount output before submitting tx is: ${transactionId}`
  );

  // let multisigSubmitTx = await multisigContract.submitTransaction(
  //   treasuryVesterAddress,
  //   0,
  //   txBytecode
  // );

  console.log(`transaction${transactionId} for approving is submitted.`);

  // IMPERSONATING

  // await multisigContractImpersonatedP1.confirmTransaction(transactionId);
  // console.log("Confirmed by P1.");
  // await multisigContractImpersonatedP2.confirmTransaction(transactionId);
  // console.log("Confirmed by P2.");

  // let isConfirmed = await multisigContract.isConfirmed(transactionId);

  // if (isConfirmed) {
  //   console.log("Approving tx is confirmed.");
  //   // await multisigContractImpersonatedP2.executeTransaction(transactionId);
  //   console.log(await multisigContract.transactions(transactionId));
  // }

  // console.log(await treasuryVesterContract.vestingEnabled());

  // call distribute() until a bot is set up
  await treasuryVesterContract.distribute();

  // { gasLimit: 2000000 } -> add gasLimit if execution tx is failed.
}

main();
