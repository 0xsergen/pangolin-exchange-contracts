const { ethers } = require("hardhat");

async function main() {
  const factory = await ethers.getContractFactory("PangolinPair");
  const bytecode = factory.bytecode;
  console.log(ethers.utils.keccak256(bytecode));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
