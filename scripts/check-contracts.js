const { ethers } = require("hardhat");

async function main() {
  // needed deployed contracts to read info
  // const multisigContract = await ethers.getContractAt(
  //   "MultiSigWalletWithDailyLimit",
  //   "0x90CE7198211D6B17be9fa5204701F9c9aCe2970b"
  // );

  // const timelockContract = await ethers.getContractAt(
  //   "Timelock",
  //   "0xdA291D8daD1c55BBe828c91C58d16A523148bE11"
  // );
  const factory = await ethers.getContractAt(
    "PangolinFactory",
    "0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438"
  );

  console.log(await factory.feeTo());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
