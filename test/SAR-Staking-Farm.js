// test/SAR-Stakign-Farm.js
// Load dependencies
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { ALL_CHAINS, CHAINS, ChainId } = require("@pangolindex/sdk");
// const { describe, it } = require("node:test");
const {
  PNG_SYMBOL,
  PNG_NAME,
  WRAPPED_NATIVE_TOKEN,
  VESTER_ALLOCATIONS,
  REVENUE_DISTRIBUTION,
  WETH_PNG_FARM_ALLOCATION,
} = require(`../constants/avalanche_fuji.js`);
// require(`../constants/${network.name}.js`);

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

////////////////////////////
// CHANGE THESE VARIABLES //
const contractAddresses = CHAINS[ChainId.FUJI].contracts;
////////////////////////////

// Start test block
describe("SAR-Staking-Farm", function () {
  let tokenA, tokenB;
  before(async function () {
    [this.admin] = await ethers.getSigners();

    // Give practically infinite ether to main user.
    await network.provider.send("hardhat_setBalance", [
      this.admin.address,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    ]);

    // get contract factories
    this.Pangolin = await ethers.getContractFactory("Png");
    // this.Factory = await ethers.getContractFactory("PangolinFactory");
    // this.Wavax = await ethers.getContractFactory("WAVAX");
    // this.Pair = await ethers.getContractFactory("PangolinPair");
    // this.Router = await ethers.getContractFactory("PangolinRouter");
    this.PangoChef = await ethers.getContractFactory("PangoChef");
    this.RewardFundingForwarder = await ethers.getContractFactory(
      "RewardFundingForwarder"
    );
    this.TokenMetadata = await ethers.getContractFactory("TokenMetadata");
    this.PangolinStakingPositions = await ethers.getContractFactory(
      "PangolinStakingPositions"
    );

    this.pairContract = await ethers.getContractFactory("PangolinPair");

    tokenA = await this.Pangolin.deploy(
      ethers.utils.parseEther("100000000"), // _maxSupply
      ethers.utils.parseEther("100000000"), // initialSupply
      "TOKA", // _symbol
      "Token A" // _name
    );
    await tokenA.deployed();

    tokenB = await this.Pangolin.deploy(
      ethers.utils.parseEther("100000000"), // _maxSupply
      ethers.utils.parseEther("100000000"), // initialSupply
      "TOKB", // _symbol
      "Token B" // _name
    );
    await tokenB.deployed();

    // get already minted contracts
    this.pngContract = await ethers.getContractAt("Png", contractAddresses.png);
    this.factoryContract = await ethers.getContractAt(
      "PangolinFactory",
      contractAddresses.factory
    );

    this.treasuryVesterContract = await ethers.getContractAt(
      "TreasuryVester",
      contractAddresses.treasury_vester
    );
    this.timelockAddress = await this.treasuryVesterContract.owner();
    this.timelockContract = await ethers.getContractAt(
      "Timelock",
      this.timelockAddress
    );

    this.multisigAddress = await this.timelockContract.admin();
    this.multisigContract = await ethers.getContractAt(
      "MultiSigWalletWithDailyLimit",
      this.multisigAddress
    );

    this.feeCollectorContract = await ethers.getContractAt(
      "FeeCollector",
      contractAddresses.fee_collector
    );

    // DEPLOYING SAR FARM
    this.chefContract = await this.PangoChef.deploy(
      contractAddresses.png,
      this.admin.address,
      contractAddresses.factory,
      contractAddresses.wrapped_native_token
    );

    this.chefFundForwarderContract = await this.RewardFundingForwarder.deploy(
      this.chefContract.address
    );

    // DEPLOYING SAR STAKING
    this.stakingMetadataContract = await this.TokenMetadata.deploy(
      this.multisigAddress,
      PNG_SYMBOL
    );

    this.stakingContract = await this.PangolinStakingPositions.deploy(
      contractAddresses.png,
      this.admin.address,
      this.stakingMetadataContract.address
    );

    this.stakingFundForwarderContract =
      await this.RewardFundingForwarder.deploy(this.stakingContract.address);

    /*******************
     * PANGOCHEF ROLES *
     *******************/

    await this.chefContract.grantRole(
      FUNDER_ROLE,
      contractAddresses.treasury_vester
    );
    // await confirmTransactionCount();
    await this.chefContract.grantRole(
      FUNDER_ROLE,
      this.chefFundForwarderContract.address
    );
    // await confirmTransactionCount();
    await this.chefContract.grantRole(FUNDER_ROLE, this.multisigAddress);
    // await confirmTransactionCount();
    await this.chefContract.grantRole(POOL_MANAGER_ROLE, this.multisigAddress);
    // await confirmTransactionCount();
    await this.chefContract.grantRole(DEFAULT_ADMIN_ROLE, this.multisigAddress);
    // await confirmTransactionCount();
    console.log("Added TreasuryVester as PangoChef funder.");

    await this.chefContract.setWeights(["0"], [WETH_PNG_FARM_ALLOCATION]);
    // await confirmTransactionCount();
    console.log("Gave 30x weight to PNG-NATIVE_TOKEN");

    await this.chefContract.renounceRole(FUNDER_ROLE, this.admin.address);
    // await confirmTransactionCount();
    await this.chefContract.renounceRole(POOL_MANAGER_ROLE, this.admin.address);
    // await confirmTransactionCount();
    await this.chefContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      this.admin.address
    );
    // await confirmTransactionCount();
    console.log("Transferred PangoChef ownership to Multisig.");

    /************************* *
     * STAKING POSITIONS ROLES *
     ************************* */

    await this.stakingContract.grantRole(
      FUNDER_ROLE,
      contractAddresses.fee_collector
    );
    // await confirmTransactionCount();
    await this.stakingContract.grantRole(
      FUNDER_ROLE,
      this.stakingFundForwarderContract.address
    );
    // await confirmTransactionCount();
    await this.stakingContract.grantRole(FUNDER_ROLE, this.multisigAddress);
    // await confirmTransactionCount();
    await this.stakingContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      this.multisigAddress
    );
    // await confirmTransactionCount();
    console.log("Added FeeCollector as PangolinStakingPosition funder.");

    await this.stakingContract.renounceRole(FUNDER_ROLE, this.admin.address);
    // await confirmTransactionCount();
    await this.stakingContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      this.admin.address
    );
    // await confirmTransactionCount();
    console.log("Transferred PangolinStakingPositions ownership to Multisig.");

    // CHANGING VESTER ALLOCATION. (treasury, multisig, chefFundForwarder)

    this.vesterAllocations = [];
    for (let i = 0; i < VESTER_ALLOCATIONS.length; i++) {
      let recipientAddress;
      let isMiniChef;
      if (VESTER_ALLOCATIONS[i].recipient == "treasury") {
        recipientAddress = contractAddresses.community_treasury;
        isMiniChef = false;
      } else if (VESTER_ALLOCATIONS[i].recipient == "multisig") {
        recipientAddress = this.multisigAddress;
        isMiniChef = false;
      } else if (VESTER_ALLOCATIONS[i].recipient == "chef") {
        recipientAddress = this.chefFundForwarderContract.address;
        isMiniChef = true;
      }

      this.vesterAllocations.push([
        recipientAddress,
        VESTER_ALLOCATIONS[i].allocation,
        isMiniChef,
      ]);
    }

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [this.timelockAddress],
    });

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [this.multisigAddress],
    });

    this.timelockSigner = await ethers.getSigner(this.timelockAddress);
    this.multisigSigner = await ethers.getSigner(this.multisigAddress);

    // Ensure governor has gas to send txs
    await this.admin.sendTransaction({
      to: this.timelockAddress,
      value: ethers.utils.parseEther("10"),
    });
    await this.admin.sendTransaction({
      to: this.multisigAddress,
      value: ethers.utils.parseEther("10"),
    });

    // await hre.network.provider.request({
    //   method: "hardhat_stopImpersonatingAccount",
    //   params: [this.timelockAddress],
    // });

    // await hre.network.provider.request({
    //   method: "hardhat_stopImpersonatingAccount",
    //   params: [this.multisigAddress],
    // });

    // end of the `before` part
  });

  //////////////////////////////
  //       Ownership
  //////////////////////////////
  describe("Ownership", function () {
    it("pangoChef deployer ownership renounce for DEFAULT_ADMIN_ROLE", async function () {
      expect(
        await this.chefContract.hasRole(DEFAULT_ADMIN_ROLE, this.admin.address)
      ).to.equal(false);
    });

    it("pangoChef deployer ownership renounce for FUNDER_ROLE", async function () {
      expect(
        await this.chefContract.hasRole(FUNDER_ROLE, this.admin.address)
      ).to.equal(false);
    });

    it("pangoChef deployer ownership renounce for POOL_MANAGER_ROLE", async function () {
      expect(
        await this.chefContract.hasRole(POOL_MANAGER_ROLE, this.admin.address)
      ).to.equal(false);
    });

    it("pangoChef multisig ownership for DEFAULT_ADMIN_ROLE", async function () {
      expect(
        await this.chefContract.hasRole(
          DEFAULT_ADMIN_ROLE,
          this.multisigAddress
        )
      ).to.equal(true);
    });

    // staking role checks

    it("stakingContract deployer ownership renounce for DEFAULT_ADMIN_ROLE", async function () {
      expect(
        await this.stakingContract.hasRole(
          DEFAULT_ADMIN_ROLE,
          this.admin.address
        )
      ).to.equal(false);
    });

    it("stakingContract deployer ownership renounce for FUNDER_ROLE", async function () {
      expect(
        await this.stakingContract.hasRole(FUNDER_ROLE, this.admin.address)
      ).to.equal(false);
    });

    it("stakingContract multisig ownership for DEFAULT_ADMIN_ROLE", async function () {
      expect(
        await this.stakingContract.hasRole(
          DEFAULT_ADMIN_ROLE,
          this.multisigAddress
        )
      ).to.equal(true);
    });
  });

  //////////////////////////////
  //       Workflow
  //////////////////////////////

  describe("Workflow", function () {
    it("treasuryVester recipient is changed to new pangoChef's fund forwarder", async function () {
      await this.treasuryVesterContract
        .connect(this.timelockSigner)
        .setRecipients(this.vesterAllocations);
      const recipients = await this.treasuryVesterContract.getRecipients();
      expect(recipients.slice(-1)[0].account).to.equal(
        this.chefFundForwarderContract.address
      );
    });

    it("feeCollector reward contract is changed to new SAR staking", async function () {
      await this.feeCollectorContract
        .connect(this.multisigSigner)
        .setRewardsContract(this.stakingContract.address);

      const stakingReward = await this.feeCollectorContract.stakingRewards();
      expect(stakingReward).to.equal(this.stakingContract.address);
    });

    it("treasuryVester distribute function funds pangoChef correctly", async function () {
      await this.treasuryVesterContract
        .connect(this.timelockSigner)
        .startVesting();
      console.log(await this.pngContract.balanceOf(this.chefContract.address));

      await this.treasuryVesterContract.distribute();
      expect(
        await this.pngContract.balanceOf(this.chefContract.address)
      ).to.equal("1102150416666666666666666");

      console.log(await this.pngContract.balanceOf(this.chefContract.address));
    });

    it("feeCollector harvest function funds staking contract correctly", async function () {
      let pair_PGL;
      await this.factoryContract.createPair(tokenA.address, tokenB.address);
      const address = await this.factoryContract.getPair(
        tokenA.address,
        tokenB.address
      );
      pair_PGL = this.pairContract.attach(address);
      await tokenA
        .connect(this.admin)
        .transfer(pair_PGL.address, ethers.utils.parseEther("100000"));
      await tokenB
        .connect(this.admin)
        .transfer(pair_PGL.address, ethers.utils.parseEther("100000"));
      await pair_PGL.connect(this.admin).mint(this.admin.address);
      const bal = await pair_PGL.balanceOf(this.admin.address);
      await pair_PGL
        .connect(this.admin)
        .transfer(this.feeCollectorContract.address, bal);
      console.log(`Reserves for PGL: ${await pair_PGL.getReserves()}`);
      console.log(
        `PGL balance of FeeCollector: ${await pair_PGL.balanceOf(
          this.feeCollectorContract.address
        )}`
      );
      await expect(
        this.feeCollectorContract
          .connect(this.multisigSigner)
          .harvest([pair_PGL.address], false, 0)
      ).not.to.be.reverted;
    });
  });
});
