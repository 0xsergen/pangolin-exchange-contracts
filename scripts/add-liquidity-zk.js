const { ethers } = require("ethers");
require("dotenv").config();
// import {} from "ethers";

const { ROUTER, TOKEN } = require("../abi/abi.json");

async function main() {
  const routerAddress = "0xDF0620DA2C36c1a350E4C285D26790CE46cb5C04"; // zkSync Testnet Pangolin Router
  const token0Address = "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b"; // DAI Token on zkSync Testnet
  const token1Address = "0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78"; // LINK Token on zkSync Testnet
  const rpc = "https://zksync2-testnet.zksync.dev";

  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const routerContract = new ethers.Contract(routerAddress, ROUTER, signer);

  const amountToken0 = 10; // B Token amount in unit of AVAX. i.e. 10 PNG

  const amountToken0InWei = ethers.utils.parseUnits(
    amountToken0.toString(),
    18
  );

  const amountToken1InWei = amountToken0InWei;

  const deadline = (await provider.getBlock("latest")).timestamp + 600 * 60; // now + 600 minutes

  //// Allowance check
  const token0Contract = new ethers.Contract(token0Address, TOKEN, signer);
  const token1Contract = new ethers.Contract(token1Address, TOKEN, signer);
  await token0Contract.approve(routerAddress, amountToken0InWei);
  await token1Contract.approve(routerAddress, amountToken1InWei);
  console.log(await token0Contract.allowance(signer.address, routerAddress));
  console.log(await token1Contract.allowance(signer.address, routerAddress));

  //// Trying adding liquidity without AVAX. Let's say DAI - LINK
  console.log(`Signer address is ${signer.address}`);
  const gasLimit = await routerContract.estimateGas.addLiquidity(
    token0Address,
    token1Address,
    amountToken0InWei,
    amountToken1InWei,
    amountToken0InWei,
    amountToken1InWei,
    signer.address,
    deadline
  );
  console.log(gasLimit);

  // let tx = await routerContract.addLiquidity(
  //   token0Address,
  //   token1Address,
  //   amountToken0InWei,
  //   amountToken1InWei,
  //   amountToken0InWei,
  //   amountToken1InWei,
  //   signer.address,
  //   deadline,
  //   { gasLimit: 100000 }
  // );

  // console.log(tx);
}

main();
