// Wrapped Native Token is 0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273

// ============
//  DEPLOYMENT
// ============
// 0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273 : WAVAX
// 0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438 : Png
// 0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8 : MultiSigWalletWithDailyLimit
// 0x259F60251abb18B307FF37FD4DcD3657FCa52074 : Timelock
// 0x4a2ba0812a92c78b3975bA25509b08b49972dFFa : PangolinFactory
// 0x1435422E3765898D3bD167DC06b36e9a8AEf4784 : PangolinRouter
// 0x2C6C561ab9C24cB12f24B886F055c1F972819b8D : CommunityTreasury
// 0x28B8C90F9A1622a1EAba08a125196f38fb9B13ED : PangoChef
// 0x3D96DD45deae7491A294252E22E8F640Ce527dbe : RewardFundingForwarder
// 0x069731B89060351874689325aA6d12575972A694 : TokenMetadata
// 0xDd1a0e81496bB29fE8f8917ff1a8A50b45194ac2 : PangolinStakingPositions
// 0xBA1445F5208D6E17146d2D58e37916c583C26B9f : RewardFundingForwarder
// 0xb52Fa2153F2cFD02CFF545c55479f3D5cd73292e : MerkledropToStaking
// 0x95087BaAcDb2713b4CA5cD2F79532fA92694b87F : TreasuryVesterLinear
// 0xe789277c602bD78D80fFa38B957b41a548E792f9 : FeeCollector
// 0x1E253ce1648e498db48960A5dAb9Fc63Cf9c418D : Multicall

// ===============
//  CONFIGURATION
// ===============
// Set airdrop merkle root.
// Transferred airdrop ownership to multisig.
// Transferred CommunityTreasury ownership to Timelock.
// Gave PNG minting role to TreasuryVester.
// Renounced PNG admin role to multisig.
// Transferred 2300000 PCT2 to Airdrop.
// Transferred 6900000 PCT2 to Multisig.
// Transferred TreasuryVester ownership to Timelock.
// Set FeeCollector as the swap fee recipient.
// Transferred PangolinFactory ownership to Multisig.
// Added TreasuryVester as PangoChef funder.
// Gave 30x weight to PNG-NATIVE_TOKEN
// Transferred PangoChef ownership to Multisig.
// Added FeeCollector as PangolinStakingPosition funder.
// Transferred PangolinStakingPositions ownership to Multisig.
exports.ADDRESSES = [
  {
    address: "0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438",
    args: [
      { type: "BigNumber", hex: "0xbe4064fbcc1d7ea6000000" },
      { type: "BigNumber", hex: "0x079c2cffd4f6f096000000" },
      "Pangolin Coston2",
      "PCT2",
    ],
  },
  {
    address: "0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8",
    args: [
      [
        "0x0000B0907d933104A582B399128502f62a48F3ac",
        "0x72C397908Cb93d1B569BBB0Ff8d3D26B7b21d730",
        "0xFCE4a07f5786c255B36D463DAeFBaA3CB42fbf03",
        "0xDA315a838E918026E51A864c43766f5AE86be8c6",
        "0xd1Bc4131BfE891A42C2756e6a80d052e25bbefeC",
        "0x372E6c7CD93Df13A799A390b7DDa7C211abA63B4",
        "0x4E8D65A98F59C66a99Bdd7867A28Ca9881EFe96B",
      ],
      3,
      0,
    ],
  },
  {
    address: "0x259F60251abb18B307FF37FD4DcD3657FCa52074",
    args: ["0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8", 259200],
  },
  {
    address: "0x4a2ba0812a92c78b3975bA25509b08b49972dFFa",
    args: ["0x5294eb1736E928CAD0B261067354280D07a1417A"],
  },
  {
    address: "0x1435422E3765898D3bD167DC06b36e9a8AEf4784",
    args: [
      "0x4a2ba0812a92c78b3975bA25509b08b49972dFFa",
      "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273",
    ],
  },
  {
    address: "0x2C6C561ab9C24cB12f24B886F055c1F972819b8D",
    args: ["0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438"],
  },
  {
    address: "0x28B8C90F9A1622a1EAba08a125196f38fb9B13ED",
    args: [
      "0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438",
      "0x5294eb1736E928CAD0B261067354280D07a1417A",
      "0x4a2ba0812a92c78b3975bA25509b08b49972dFFa",
      "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273",
    ],
  },
  {
    address: "0x3D96DD45deae7491A294252E22E8F640Ce527dbe",
    args: ["0x28B8C90F9A1622a1EAba08a125196f38fb9B13ED"],
  },
  {
    address: "0x069731B89060351874689325aA6d12575972A694",
    args: ["0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8", "PCT2"],
  },
  {
    address: "0xDd1a0e81496bB29fE8f8917ff1a8A50b45194ac2",
    args: [
      "0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438",
      "0x5294eb1736E928CAD0B261067354280D07a1417A",
      "0x069731B89060351874689325aA6d12575972A694",
    ],
  },
  {
    address: "0xBA1445F5208D6E17146d2D58e37916c583C26B9f",
    args: ["0xDd1a0e81496bB29fE8f8917ff1a8A50b45194ac2"],
  },
  {
    address: "0xb52Fa2153F2cFD02CFF545c55479f3D5cd73292e",
    args: [
      "0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438",
      "0xDd1a0e81496bB29fE8f8917ff1a8A50b45194ac2",
      "0x5294eb1736E928CAD0B261067354280D07a1417A",
    ],
  },
  {
    address: "0x95087BaAcDb2713b4CA5cD2F79532fA92694b87F",
    args: [
      "0x6169CD307Be7E24152dF23a7A945A1ea3eC7b438",
      [
        ["0x2C6C561ab9C24cB12f24B886F055c1F972819b8D", 1354, false],
        ["0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8", 3385, false],
        ["0x3D96DD45deae7491A294252E22E8F640Ce527dbe", 5261, true],
      ],
      "0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8",
      { type: "BigNumber", hex: "0x33f38bf132f559555555" },
    ],
  },
  {
    address: "0xe789277c602bD78D80fFa38B957b41a548E792f9",
    args: [
      "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273",
      "0x4a2ba0812a92c78b3975bA25509b08b49972dFFa",
      "0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545",
      "0xDd1a0e81496bB29fE8f8917ff1a8A50b45194ac2",
      "0x0000000000000000000000000000000000000000",
      "0",
      "0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8",
      "0x259F60251abb18B307FF37FD4DcD3657FCa52074",
      "0x3dC36E8244e9A9aeF85129475015db6F4aBAa3b8",
    ],
  },
];
