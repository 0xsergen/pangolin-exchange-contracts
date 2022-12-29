const { ethers } = require("hardhat");
// const CONFIG = require("../../config/config");
// const ABI = require("../../config/abi.json");
// const ADDRESS = require("../../config/address.json");
const Web3 = require("web3");

// Change These Variables
// ---------------------------------------------------------------
const web3 = new Web3(
  new Web3.providers.HttpProvider("https://eth.bd.evmos.dev:8545")
);

const factoryAddress = "0x02fD35823a82b8f02e5F2d1a351807B9d1B38c3B";
const routerAddress = "0x6b6D3049dD90E6Ecc84f8dca55f4A847b3a63fc2";
const multisigAddress = "0x90CE7198211D6B17be9fa5204701F9c9aCe2970b";
const nativeTokenAddress = "0xcF5ef8d007a616066e5eaEa0916592374a0F478D";
const pngAddress = "0x171a6A80cdDDd8f69134ff0471523400f2C16ABe";
// ---------------------------------------------------------------

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\nDeployer:", deployer.address);

  const factoryContract = await ethers.getContractAt(
    "PangolinFactory",
    factoryAddress
  );

  const routerContract = await ethers.getContractAt(
    "PangolinRouter",
    routerAddress
  );
  const poolCount = await factoryContract.allPairsLength();
  console.log(`Found ${poolCount} pools`);

  // CONTROLS FOR EXISTING LIQUIDITY POOLS

  if (poolCount > 1) {
    console.log("Pool amount is bigger than 1. Check the pools.");
  }
  let i = 0;
  const pglAddress = await factoryContract.allPairs(i);

  const pgl = await ethers.getContractAt("PangolinPair", pglAddress);
  const [token0Address, token1Address] = await Promise.all([
    pgl.token0(),
    pgl.token1(),
  ]);

  const tokenReserves = await pgl.getReserves();

  if (token0Address != pngAddress && token1Address != nativeTokenAddress) {
    console.log("Pool doesn't belong to PNG-WAVAX.");
    return;
  }

  if (tokenReserves._reserve0 != 0 || tokenReserves._reserve1 != 0) {
    console.log("There is already liquidity in that pool.");
    return;
  }

  const tokenABI = [
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  const token0 = new ethers.Contract(token0Address, tokenABI, deployer);
  const token1 = new ethers.Contract(token1Address, tokenABI, deployer);

  const pngContract = await ethers.getContractAt("Png", pngAddress);

  try {
    // Token is a loose standard and might not have a `name` method
    const [symbol0, symbol1] = await Promise.all([
      token0.symbol(),
      token1.symbol(),
    ]);
    console.log(`${pglAddress} (${i}): ${symbol0}-${symbol1}`);
  } catch (e) {
    console.error(`Invalid symbol() call for ${pglAddress} (${i})`);
  }

  token0Decimal = await token0.decimals();
  token1Decimal = await token1.decimals();
  if (token0Decimal != 18 || token1Decimal != 18) {
    console.log(
      "Token decimal is different than 18. Please be sure to calculate correct amount."
    );
    return;
  }

  amountPNGTokenInAVAX = 500; // PNG Token amount in unit of AVAX. 500 PNG.
  amountAVAXinAVAX = 50; // Native coin amount in unit of AVAX. 50 EVMOS.

  amountPNGTokenInWei = web3.utils.toWei(
    amountPNGTokenInAVAX.toString(),
    "ether"
  );
  amountAVAXinWei = web3.utils.toWei(amountAVAXinAVAX.toString(), "ether");
  deadline = (await web3.eth.getBlock("latest")).timestamp + 600 * 60; // now + 600 minutes
  // console.log(deadline);

  // Approving TX to approve the token.
  approveTxABI = pngContract.interface.encodeFunctionData("approve", [
    routerAddress,
    amountPNGTokenInWei,
  ]);

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
  //   routerContract.connect(impersonatedAccount);

  // const multisigContractImpersonatedP1 =
  //   multisigContract.connect(multi1Account);

  // const multisigContractImpersonatedP2 =
  //   multisigContract.connect(multi2Account);

  // await deployer.sendTransaction({
  //   to: multisigAddress,
  //   value: ethers.utils.parseEther("60"),
  // });

  // await deployer.sendTransaction({
  //   to: multi1,
  //   value: ethers.utils.parseEther("0.1"),
  // });

  // await deployer.sendTransaction({
  //   to: multi2,
  //   value: ethers.utils.parseEther("0.1"),
  // });

  // let transactionId = await multisigContract.transactionCount();
  // console.log(
  //   `transactionCount output before submitting tx is: ${transactionId}`
  // );

  // console.log(await multisigContract.getOwners());

  // let multisigSubmitTx = await multisigContract.submitTransaction(
  //   pngAddress,
  //   0,
  //   approveTxABI
  // );
  // console.log(`png address: ${pngAddress}`);
  // console.log(`value: 0`);
  // console.log(`approve TX bytecode: ${approveTxABI}`);

  // console.log(`transaction${transactionId} for approving is submitted.`);
  //   console.log(await multisigContract.getConfirmations(transactionId));

  // await multisigContractImpersonatedP1.confirmTransaction(transactionId);
  // console.log("Confirmed by P1.");
  // await multisigContractImpersonatedP2.confirmTransaction(transactionId);
  // console.log("Confirmed by P2.");

  // let isConfirmed = await multisigContract.isConfirmed(transactionId);

  // if (isConfirmed) {
  //   console.log("Approving tx is confirmed.");
  //   console.log(await multisigContract.transactions(transactionId));
  // }

  // Creating TX to addingLiquidity
  // addLiquidityAVAX(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountAVAXMin, address to, uint256 deadline)
  liqTxABI = routerContract.interface.encodeFunctionData("addLiquidityAVAX", [
    pngAddress,
    amountPNGTokenInWei,
    amountPNGTokenInWei,
    amountAVAXinWei,
    multisigAddress,
    deadline,
  ]);

  transactionId = await multisigContract.transactionCount();
  console.log(
    `transactionCount output before submitting adding liquidity tx is: ${transactionId}`
  );

  multisigSubmitTx = await multisigContract.submitTransaction(
    routerAddress,
    amountAVAXinWei,
    liqTxABI,
    { gasLimit: 2000000 }
  );
  console.log(`router address: ${routerAddress}`);
  console.log(`amount avax in wei: ${amountAVAXinWei}`);
  console.log(`liq TX bytecode: ${liqTxABI}`);

  console.log(`transaction${transactionId} is submitted.`);

  // await multisigContractImpersonatedP1.confirmTransaction(transactionId, {
  //   gasLimit: 2000000,
  // });
  // console.log("Confirmed by P1.");
  // await multisigContractImpersonatedP2.confirmTransaction(transactionId, {
  //   gasLimit: 2000000,
  // });
  // console.log("Confirmed by P2.");

  // isConfirmed = await multisigContract.isConfirmed(transactionId);

  // if (isConfirmed) {
  //   console.log("Adding liquidity tx is confirmed.");
  //   // await multisigContractImpersonatedP2.executeTransaction(transactionId);
  //   console.log(await multisigContract.transactions(transactionId));
  // }

  // const pglContract = await ethers.getContractAt("PangolinPair", pglAddress);
  // console.log(await pglContract.getReserves());
}

main();
