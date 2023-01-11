const { ethers } = require("hardhat");

async function main() {
  // needed deployed contracts to read info
  // const multisigContract = await ethers.getContractAt(
  //   "MultiSigWalletWithDailyLimit",
  //   "0x90CE7198211D6B17be9fa5204701F9c9aCe2970b"
  // );
  // const airdropContract = await ethers.getContractAt(
  //   "MerkledropToStaking",
  //   "0x2D1B541Cb20aD73217aC30cbA07C4571AF729Bc7"
  // );
  const treasuryVesterContract = await ethers.getContractAt(
    "TreasuryVesterLinear",
    "0x6B77Cb69Dae236bC708d75B76356911D2D197601"
  );
  // const communityTreasuryContract = await ethers.getContractAt(
  //   "CommunityTreasury",
  //   "0x3520e13c0E3f49Aa522dBD4477280fe3DF8B40fC"
  // );

  // const pangoChefContract = await ethers.getContractAt(
  //   "PangoChef",
  //   "0xA96b69EE04E33E1752b059a7a9B7C9FE2B3C93A9"
  // );

  // const timelockContract = await ethers.getContractAt(
  //   "Timelock",
  //   "0xdA291D8daD1c55BBe828c91C58d16A523148bE11"
  // );

  // const stakingContract = await ethers.getContractAt(
  //   "PangolinStakingPositions",
  //   "0x997415e58dAEa9117027d55DAB7E765748C50834"
  // );
  console.log(
    `Is vesting started for treasuryVester : ${await treasuryVesterContract.vestingEnabled()}`
  );

  console.log(
    `Last time when distribute function is called: ${await treasuryVesterContract.lastUpdate()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
