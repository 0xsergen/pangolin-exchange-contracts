"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
var utils_1 = require("./utils");
var fixture_1 = __importDefault(require("./fixture"));
var hardhat_2 = require("hardhat");
var ethers_1 = require("ethers");
describe("BridgeMigrationRouter", function () {
    return __awaiter(this, void 0, void 0, function () {
        var accountGenerator, owner, account, WAVAX, factory, migrationRouter;
        var _this = this;
        return __generator(this, function (_a) {
            before(function () { return __awaiter(_this, void 0, void 0, function () {
                var bridgeTokenFactory, factory, router, _i, _a, tokenSymbol, tokenAddress, bridgeToken, _b, _c, tokenSymbol, tokenAddress, price, _d, _e, _f, _g, tokenSymbol, tokenAddress, price, bn0, bn1, _h, token0, token1, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0: return [4 /*yield*/, (0, hardhat_2.run)("compile")];
                        case 1:
                            _l.sent();
                            return [4 /*yield*/, (0, utils_1.makeAccountGenerator)()];
                        case 2:
                            accountGenerator = _l.sent();
                            return [4 /*yield*/, hardhat_1.ethers.getContractFactory("BridgeToken")];
                        case 3:
                            bridgeTokenFactory = _l.sent();
                            return [4 /*yield*/, (0, utils_1.getOwnerAccount)()];
                        case 4:
                            owner = _l.sent();
                            return [4 /*yield*/, (0, utils_1.getWAVAXContract)()];
                        case 5:
                            WAVAX = _l.sent();
                            return [4 /*yield*/, hardhat_1.ethers.getContractAt("PangolinFactory", fixture_1.default.Factory)];
                        case 6:
                            factory = _l.sent();
                            return [4 /*yield*/, hardhat_1.ethers.getContractAt("PangolinRouter", fixture_1.default.Router)];
                        case 7:
                            router = _l.sent();
                            return [4 /*yield*/, (0, utils_1.fundWAVAX)(owner, ethers_1.BigNumber.from(10).pow(28))];
                        case 8:
                            _l.sent();
                            return [4 /*yield*/, (0, utils_1.fundToken)(owner, fixture_1.default.Tokens.PNG, ethers_1.BigNumber.from(10).pow(25))];
                        case 9:
                            _l.sent();
                            return [4 /*yield*/, (0, utils_1.getTokenContract)(fixture_1.default.Tokens.WAVAX)];
                        case 10: return [4 /*yield*/, (_l.sent()).approve(router.address, hardhat_1.ethers.constants.MaxUint256)];
                        case 11:
                            _l.sent();
                            return [4 /*yield*/, (0, utils_1.getTokenContract)(fixture_1.default.Tokens.PNG)];
                        case 12: return [4 /*yield*/, (_l.sent()).approve(router.address, hardhat_1.ethers.constants.MaxUint256)
                            // in case we don't have the migrator deployed, it deploys migrators
                        ];
                        case 13:
                            _l.sent();
                            _i = 0, _a = Object.keys(fixture_1.default.Migrators);
                            _l.label = 14;
                        case 14:
                            if (!(_i < _a.length)) return [3 /*break*/, 21];
                            tokenSymbol = _a[_i];
                            tokenAddress = fixture_1.default.Tokens[tokenSymbol];
                            if (fixture_1.default.Migrators[tokenSymbol] !== "") {
                                return [3 /*break*/, 20];
                            }
                            return [4 /*yield*/, bridgeTokenFactory.deploy()];
                        case 15:
                            bridgeToken = _l.sent();
                            return [4 /*yield*/, bridgeToken.deployed];
                        case 16:
                            _l.sent();
                            return [4 /*yield*/, bridgeToken.addSwapToken(tokenAddress, hardhat_1.ethers.constants.MaxUint256)];
                        case 17:
                            _l.sent();
                            fixture_1.default.Migrators[tokenSymbol] = bridgeToken.address;
                            return [4 /*yield*/, bridgeToken.connect(owner).mint(owner.address, ethers_1.BigNumber.from("1000000000000000000000000000000000"), "0xc7198437980c041c805a1edcba50c1ce5db95118", 0, hardhat_1.ethers.utils.formatBytes32String("test"))];
                        case 18:
                            _l.sent();
                            return [4 /*yield*/, bridgeToken.connect(owner).approve(router.address, hardhat_1.ethers.constants.MaxUint256)];
                        case 19:
                            _l.sent();
                            _l.label = 20;
                        case 20:
                            _i++;
                            return [3 /*break*/, 14];
                        case 21:
                            _b = 0, _c = Object.keys(fixture_1.default.Pairs.Migrated.AVAX);
                            _l.label = 22;
                        case 22:
                            if (!(_b < _c.length)) return [3 /*break*/, 28];
                            tokenSymbol = _c[_b];
                            tokenAddress = fixture_1.default.Migrators[tokenSymbol];
                            if (!tokenAddress)
                                return [3 /*break*/, 27];
                            if (fixture_1.default.Pairs.Migrated.AVAX[tokenSymbol] !== "") {
                                return [3 /*break*/, 27];
                            }
                            price = ethers_1.BigNumber.from("1000000000000000000");
                            return [4 /*yield*/, factory.getPair(fixture_1.default.Tokens.WAVAX, tokenAddress)];
                        case 23:
                            if (!((_l.sent()) == hardhat_1.ethers.constants.AddressZero)) return [3 /*break*/, 25];
                            return [4 /*yield*/, router.connect(owner).addLiquidity(fixture_1.default.Tokens.WAVAX, tokenAddress, price, price.mul(2), price, price.mul(2), owner.address, (0, utils_1.getDeadline)())];
                        case 24:
                            _l.sent();
                            _l.label = 25;
                        case 25:
                            _d = fixture_1.default.Pairs.Migrated.AVAX;
                            _e = tokenSymbol;
                            return [4 /*yield*/, factory.getPair(fixture_1.default.Tokens.WAVAX, tokenAddress)];
                        case 26:
                            _d[_e] = _l.sent();
                            _l.label = 27;
                        case 27:
                            _b++;
                            return [3 /*break*/, 22];
                        case 28:
                            _f = 0, _g = Object.keys(fixture_1.default.Pairs.Migrated.PNG);
                            _l.label = 29;
                        case 29:
                            if (!(_f < _g.length)) return [3 /*break*/, 33];
                            tokenSymbol = _g[_f];
                            tokenAddress = fixture_1.default.Migrators[tokenSymbol];
                            if (!tokenAddress)
                                return [3 /*break*/, 32];
                            if (fixture_1.default.Pairs.Migrated.PNG[tokenSymbol] !== "") {
                                return [3 /*break*/, 32];
                            }
                            price = ethers_1.BigNumber.from("1000000000000000000");
                            return [4 /*yield*/, router.connect(owner).addLiquidity(fixture_1.default.Tokens.PNG, tokenAddress, price, price.mul(2), price, price.mul(2), owner.address, (0, utils_1.getDeadline)())];
                        case 30:
                            _l.sent();
                            bn0 = ethers_1.BigNumber.from(fixture_1.default.Tokens.PNG);
                            bn1 = ethers_1.BigNumber.from(tokenAddress);
                            _h = bn0.gt(bn1) ? [bn1.toHexString(), bn0.toHexString()] : [bn0.toHexString(), bn1.toHexString()], token0 = _h[0], token1 = _h[1];
                            _j = fixture_1.default.Pairs.Migrated.PNG;
                            _k = tokenSymbol;
                            return [4 /*yield*/, factory.getPair(token0, token1)];
                        case 31:
                            _j[_k] = _l.sent();
                            _l.label = 32;
                        case 32:
                            _f++;
                            return [3 /*break*/, 29];
                        case 33: return [2 /*return*/];
                    }
                });
            }); });
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            account = accountGenerator();
                            _b = (_a = WAVAX.connect(account)).withdraw;
                            return [4 /*yield*/, WAVAX.balanceOf(account.address)];
                        case 1: 
                        //this is necessary, the asserts funds the account on the assumption it has 0 WAVAX
                        return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                        case 2:
                            //this is necessary, the asserts funds the account on the assumption it has 0 WAVAX
                            _c.sent();
                            return [4 /*yield*/, hardhat_1.ethers.getContractFactory("PangolinBridgeMigrationRouter")];
                        case 3:
                            factory = _c.sent();
                            return [4 /*yield*/, factory.connect(owner).deploy()];
                        case 4:
                            migrationRouter = _c.sent();
                            return [4 /*yield*/, migrationRouter.deployed()];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, (0, utils_1.fundWAVAX)(account, ethers_1.BigNumber.from(10).pow(26))];
                        case 6:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            describe("Administration", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _loop_1, _i, _a, tokenSymbol, _loop_2, _b, _c, tokenSymbol;
                    return __generator(this, function (_d) {
                        it("Can be deployed", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(owner.address)];
                                        case 1:
                                            _a.apply(void 0, [_b.sent()]).to.be.true;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        it("Admin can add admin", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, migrationRouter.connect(owner).addAdmin(account.address)];
                                        case 1:
                                            _b.sent();
                                            _a = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(account.address)];
                                        case 2:
                                            _a.apply(void 0, [_b.sent()]).to.be.true;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        it("Admin can remove admin", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, migrationRouter.connect(owner).addAdmin(account.address)];
                                        case 1:
                                            _c.sent();
                                            _a = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(account.address)];
                                        case 2:
                                            _a.apply(void 0, [_c.sent()]).to.be.true;
                                            return [4 /*yield*/, migrationRouter.connect(owner).removeAdmin(account.address)];
                                        case 3:
                                            _c.sent();
                                            _b = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(account.address)];
                                        case 4:
                                            _b.apply(void 0, [_c.sent()]).to.be.false;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        it("Others can't add admin", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(account.address)];
                                        case 1:
                                            _a.apply(void 0, [_c.sent()]).to.be.false;
                                            return [4 /*yield*/, (0, chai_1.expect)(migrationRouter.connect(account).addAdmin(account.address)).to.be.reverted];
                                        case 2:
                                            _c.sent();
                                            _b = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.isAdmin(account.address)];
                                        case 3:
                                            _b.apply(void 0, [_c.sent()]).to.be.false;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        it("Others can't remove admin", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(account.address)];
                                        case 1:
                                            _a.apply(void 0, [_c.sent()]).to.be.false;
                                            return [4 /*yield*/, (0, chai_1.expect)(migrationRouter.connect(account).removeAdmin(owner.address)).to.be.reverted];
                                        case 2:
                                            _c.sent();
                                            _b = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.isAdmin(owner.address)];
                                        case 3:
                                            _b.apply(void 0, [_c.sent()]).to.be.true;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        it("Others can't check admin", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(owner).isAdmin(account.address)];
                                        case 1:
                                            _a.apply(void 0, [_c.sent()]).to.be.false;
                                            _b = chai_1.expect;
                                            return [4 /*yield*/, migrationRouter.connect(account).isAdmin(owner.address)];
                                        case 2:
                                            _b.apply(void 0, [_c.sent()]).to.be.true;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        it("Admin can't add migrator incompatible with the token", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, chai_1.expect)(migrationRouter.connect(owner).addMigrator(fixture_1.default.Tokens.WAVAX, fixture_1.default.Migrators.WBTC)).to.be.reverted];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        _loop_1 = function (tokenSymbol) {
                            var tokenAddress = fixture_1.default.Tokens[tokenSymbol];
                            var migrator = fixture_1.default.Migrators[tokenSymbol];
                            it("Others can't add migrator for ".concat(tokenSymbol), function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, (0, chai_1.expect)(migrationRouter.connect(account).addMigrator(tokenAddress, migrator)).to.be.reverted];
                                            case 1:
                                                _b.sent();
                                                _a = chai_1.expect;
                                                return [4 /*yield*/, migrationRouter.bridgeMigrator(tokenAddress)];
                                            case 2:
                                                _a.apply(void 0, [(_b.sent()).toString().toLowerCase()]).to.equal(hardhat_1.ethers.constants.AddressZero);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        };
                        for (_i = 0, _a = Object.keys(fixture_1.default.Migrators); _i < _a.length; _i++) {
                            tokenSymbol = _a[_i];
                            _loop_1(tokenSymbol);
                        }
                        _loop_2 = function (tokenSymbol) {
                            var tokenAddress = fixture_1.default.Tokens[tokenSymbol];
                            it("Admin can add migrator for ".concat(tokenSymbol), function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var migrator, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                migrator = fixture_1.default.Migrators[tokenSymbol];
                                                return [4 /*yield*/, migrationRouter.connect(owner).addMigrator(tokenAddress, migrator)];
                                            case 1:
                                                _b.sent();
                                                _a = chai_1.expect;
                                                return [4 /*yield*/, migrationRouter.bridgeMigrator(tokenAddress)];
                                            case 2:
                                                _a.apply(void 0, [(_b.sent()).toString().toLowerCase()]).to.equal(migrator.toLowerCase());
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        };
                        for (_b = 0, _c = Object.keys(fixture_1.default.Migrators); _b < _c.length; _b++) {
                            tokenSymbol = _c[_b];
                            _loop_2(tokenSymbol);
                        }
                        return [2 /*return*/];
                    });
                });
            });
            describe("Token Migration", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _loop_3, _i, _a, tokenSymbol;
                    return __generator(this, function (_b) {
                        _loop_3 = function (tokenSymbol) {
                            var tokenAddress = fixture_1.default.Tokens[tokenSymbol];
                            it("Any can migrate for token ".concat(tokenSymbol), function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var migrator, _a, tokenAmount, tokenContract, migratedTokenAddress, migratedToken, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                migrator = fixture_1.default.Migrators[tokenSymbol];
                                                return [4 /*yield*/, migrationRouter.connect(owner).addMigrator(tokenAddress, migrator)];
                                            case 1:
                                                _c.sent();
                                                _a = chai_1.expect;
                                                return [4 /*yield*/, migrationRouter.bridgeMigrator(tokenAddress)];
                                            case 2:
                                                _a.apply(void 0, [(_c.sent()).toString().toLowerCase()]).to.equal(migrator.toLowerCase());
                                                return [4 /*yield*/, (0, utils_1.fundToken)(account, tokenAddress, ethers_1.BigNumber.from(10).pow(18))];
                                            case 3:
                                                tokenAmount = _c.sent();
                                                return [4 /*yield*/, (0, utils_1.getTokenContract)(tokenAddress)];
                                            case 4:
                                                tokenContract = _c.sent();
                                                return [4 /*yield*/, tokenContract.connect(account).approve(migrationRouter.address, hardhat_1.ethers.constants.MaxInt256)];
                                            case 5:
                                                _c.sent();
                                                return [4 /*yield*/, migrationRouter.connect(account).migrateToken(tokenAddress, account.address, tokenAmount, (0, utils_1.getDeadline)())];
                                            case 6:
                                                _c.sent();
                                                return [4 /*yield*/, migrationRouter.bridgeMigrator(tokenAddress)];
                                            case 7:
                                                migratedTokenAddress = _c.sent();
                                                return [4 /*yield*/, (0, utils_1.getTokenContract)(migratedTokenAddress)];
                                            case 8:
                                                migratedToken = _c.sent();
                                                _b = chai_1.expect;
                                                return [4 /*yield*/, migratedToken.balanceOf(account.address)];
                                            case 9:
                                                _b.apply(void 0, [_c.sent()]).to.be.equal(tokenAmount);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        };
                        for (_i = 0, _a = Object.keys(fixture_1.default.Migrators); _i < _a.length; _i++) {
                            tokenSymbol = _a[_i];
                            _loop_3(tokenSymbol);
                        }
                        return [2 /*return*/];
                    });
                });
            });
            describe("Liquidity Migration", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        describe("AVAX", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _loop_4, _i, _a, tokenSymbol;
                                return __generator(this, function (_b) {
                                    _loop_4 = function (tokenSymbol) {
                                        var tokenAddress = fixture_1.default.Tokens[tokenSymbol];
                                        if (!(tokenSymbol in fixture_1.default.Pairs.AVAX))
                                            return "continue";
                                        if (fixture_1.default.TokensWithoutFund.includes(tokenSymbol))
                                            return "continue";
                                        it("Can migrate liquidity from AVAX-".concat(tokenSymbol), function () {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var pairAddress, toPairAddress, migrator, fromPairContract, liquidityAmount, migratedPair, _a, _b, token0, _c, token1, _d, _e, _f, _g, _h;
                                                return __generator(this, function (_j) {
                                                    switch (_j.label) {
                                                        case 0:
                                                            pairAddress = fixture_1.default.Pairs.AVAX[tokenSymbol];
                                                            toPairAddress = fixture_1.default.Pairs.Migrated.AVAX[tokenSymbol];
                                                            migrator = fixture_1.default.Migrators[tokenSymbol];
                                                            return [4 /*yield*/, (0, utils_1.getTokenContract)(pairAddress)];
                                                        case 1:
                                                            fromPairContract = _j.sent();
                                                            return [4 /*yield*/, migrationRouter.connect(owner).addMigrator(tokenAddress, migrator)];
                                                        case 2:
                                                            _j.sent();
                                                            return [4 /*yield*/, (0, utils_1.fundLiquidityToken)(account, pairAddress, ethers_1.BigNumber.from(10).pow(20))];
                                                        case 3:
                                                            liquidityAmount = _j.sent();
                                                            return [4 /*yield*/, fromPairContract.connect(account).approve(migrationRouter.address, hardhat_1.ethers.constants.MaxUint256)];
                                                        case 4:
                                                            _j.sent();
                                                            return [4 /*yield*/, (0, utils_1.getPairContract)(toPairAddress)];
                                                        case 5:
                                                            migratedPair = _j.sent();
                                                            _a = chai_1.expect;
                                                            return [4 /*yield*/, migratedPair.balanceOf(account.address)];
                                                        case 6:
                                                            _a.apply(void 0, [_j.sent()]).to.equal(0);
                                                            return [4 /*yield*/, migrationRouter.connect(account).migrateLiquidity(pairAddress, toPairAddress, account.address, liquidityAmount, (0, utils_1.getDeadline)())];
                                                        case 7:
                                                            _j.sent();
                                                            _b = chai_1.expect;
                                                            return [4 /*yield*/, migratedPair.balanceOf(account.address)];
                                                        case 8:
                                                            _b.apply(void 0, [_j.sent()]).to.gt(0);
                                                            _c = utils_1.getTokenContract;
                                                            return [4 /*yield*/, migratedPair.token0()];
                                                        case 9: return [4 /*yield*/, _c.apply(void 0, [_j.sent()])];
                                                        case 10:
                                                            token0 = _j.sent();
                                                            _d = utils_1.getTokenContract;
                                                            return [4 /*yield*/, migratedPair.token1()];
                                                        case 11: return [4 /*yield*/, _d.apply(void 0, [_j.sent()])];
                                                        case 12:
                                                            token1 = _j.sent();
                                                            _e = chai_1.expect;
                                                            return [4 /*yield*/, token0.balanceOf(migrationRouter.address)];
                                                        case 13:
                                                            _e.apply(void 0, [_j.sent()]).to.equal(0);
                                                            _f = chai_1.expect;
                                                            return [4 /*yield*/, token1.balanceOf(migrationRouter.address)];
                                                        case 14:
                                                            _f.apply(void 0, [_j.sent()]).to.equal(0);
                                                            _g = chai_1.expect;
                                                            return [4 /*yield*/, migratedPair.balanceOf(migrationRouter.address)];
                                                        case 15:
                                                            _g.apply(void 0, [_j.sent()]).to.equal(0);
                                                            _h = chai_1.expect;
                                                            return [4 /*yield*/, fromPairContract.balanceOf(migrationRouter.address)];
                                                        case 16:
                                                            _h.apply(void 0, [_j.sent()]).to.equal(0);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        });
                                        it("Can compute accurately chargeback from AVAX-".concat(tokenSymbol), function () {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var pairAddress, toPairAddress, migrator, liquidityAmount, toPairContract, _a, chargeBack0, chargeBack1, token0, _b, token1, _c, previousBalance0, previousBalance1, tokenContract, _d, _e, _f, balance0, balance1, expectedChargeBack0, expectedChargeBack1;
                                                return __generator(this, function (_g) {
                                                    switch (_g.label) {
                                                        case 0:
                                                            pairAddress = fixture_1.default.Pairs.AVAX[tokenSymbol];
                                                            toPairAddress = fixture_1.default.Pairs.Migrated.AVAX[tokenSymbol];
                                                            migrator = fixture_1.default.Migrators[tokenSymbol];
                                                            return [4 /*yield*/, migrationRouter.connect(owner).addMigrator(tokenAddress, migrator)];
                                                        case 1:
                                                            _g.sent();
                                                            return [4 /*yield*/, (0, utils_1.fundLiquidityToken)(account, pairAddress, ethers_1.BigNumber.from(10).pow(20))];
                                                        case 2:
                                                            liquidityAmount = _g.sent();
                                                            return [4 /*yield*/, (0, utils_1.getPairContract)(toPairAddress)
                                                                // reads the chargeback
                                                            ];
                                                        case 3:
                                                            toPairContract = _g.sent();
                                                            return [4 /*yield*/, migrationRouter.calculateChargeBack(pairAddress, toPairAddress, liquidityAmount)
                                                                // reads the previous balance to compute the real charge back
                                                            ];
                                                        case 4:
                                                            _a = _g.sent(), chargeBack0 = _a[0], chargeBack1 = _a[1];
                                                            _b = utils_1.getTokenContract;
                                                            return [4 /*yield*/, toPairContract.token0()];
                                                        case 5: return [4 /*yield*/, _b.apply(void 0, [_g.sent()])];
                                                        case 6:
                                                            token0 = _g.sent();
                                                            _c = utils_1.getTokenContract;
                                                            return [4 /*yield*/, toPairContract.token1()];
                                                        case 7: return [4 /*yield*/, _c.apply(void 0, [_g.sent()])];
                                                        case 8:
                                                            token1 = _g.sent();
                                                            return [4 /*yield*/, token0.balanceOf(account.address)];
                                                        case 9:
                                                            previousBalance0 = _g.sent();
                                                            return [4 /*yield*/, token1.balanceOf(account.address)];
                                                        case 10:
                                                            previousBalance1 = _g.sent();
                                                            return [4 /*yield*/, (0, utils_1.getTokenContract)(pairAddress)];
                                                        case 11:
                                                            tokenContract = _g.sent();
                                                            return [4 /*yield*/, tokenContract.connect(account).approve(migrationRouter.address, hardhat_1.ethers.constants.MaxUint256)];
                                                        case 12:
                                                            _g.sent();
                                                            _d = chai_1.expect;
                                                            return [4 /*yield*/, tokenContract.balanceOf(account.address)];
                                                        case 13:
                                                            _d.apply(void 0, [_g.sent()]).to.equal(liquidityAmount);
                                                            _e = chai_1.expect;
                                                            return [4 /*yield*/, toPairContract.balanceOf(account.address)];
                                                        case 14:
                                                            _e.apply(void 0, [_g.sent()]).to.equal(0);
                                                            return [4 /*yield*/, migrationRouter.connect(account).migrateLiquidity(pairAddress, toPairAddress, account.address, liquidityAmount, (0, utils_1.getDeadline)())];
                                                        case 15:
                                                            _g.sent();
                                                            _f = chai_1.expect;
                                                            return [4 /*yield*/, toPairContract.balanceOf(account.address)];
                                                        case 16:
                                                            _f.apply(void 0, [_g.sent()]).to.gt(0);
                                                            return [4 /*yield*/, token0.balanceOf(account.address)];
                                                        case 17:
                                                            balance0 = _g.sent();
                                                            return [4 /*yield*/, token1.balanceOf(account.address)];
                                                        case 18:
                                                            balance1 = _g.sent();
                                                            expectedChargeBack0 = balance0.gte(previousBalance0) ? balance0.sub(previousBalance0) : previousBalance0.sub(balance0);
                                                            expectedChargeBack1 = balance1.gte(previousBalance1) ? balance1.sub(previousBalance1) : previousBalance1.sub(balance1);
                                                            (0, chai_1.expect)(chargeBack0).to.equal(expectedChargeBack0);
                                                            (0, chai_1.expect)(chargeBack1).to.equal(expectedChargeBack1);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        });
                                    };
                                    for (_i = 0, _a = Object.keys(fixture_1.default.Migrators); _i < _a.length; _i++) {
                                        tokenSymbol = _a[_i];
                                        _loop_4(tokenSymbol);
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        });
                        describe("PNG", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var _loop_5, _i, _a, tokenSymbol;
                                return __generator(this, function (_b) {
                                    _loop_5 = function (tokenSymbol) {
                                        var tokenAddress = fixture_1.default.Tokens[tokenSymbol];
                                        if (!(tokenSymbol in fixture_1.default.Pairs.PNG))
                                            return "continue";
                                        if (fixture_1.default.TokensWithoutFund.includes(tokenSymbol))
                                            return "continue";
                                        it("Can migrate liquidity from PNG-".concat(tokenSymbol), function () {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var pairAddress, toPairAddress, migrator, liquidityAmount, fromPairContract, migratedPair, _a, _b, token0, _c, token1, _d, _e, _f, _g, _h;
                                                return __generator(this, function (_j) {
                                                    switch (_j.label) {
                                                        case 0:
                                                            pairAddress = fixture_1.default.Pairs.PNG[tokenSymbol];
                                                            toPairAddress = fixture_1.default.Pairs.Migrated.PNG[tokenSymbol];
                                                            migrator = fixture_1.default.Migrators[tokenSymbol];
                                                            return [4 /*yield*/, migrationRouter.connect(owner).addMigrator(tokenAddress, migrator)];
                                                        case 1:
                                                            _j.sent();
                                                            return [4 /*yield*/, (0, utils_1.fundLiquidityToken)(account, pairAddress, ethers_1.BigNumber.from(10).pow(20))];
                                                        case 2:
                                                            liquidityAmount = _j.sent();
                                                            return [4 /*yield*/, (0, utils_1.getTokenContract)(pairAddress)];
                                                        case 3:
                                                            fromPairContract = _j.sent();
                                                            return [4 /*yield*/, fromPairContract.connect(account).approve(migrationRouter.address, hardhat_1.ethers.constants.MaxUint256)];
                                                        case 4:
                                                            _j.sent();
                                                            return [4 /*yield*/, (0, utils_1.getPairContract)(toPairAddress)];
                                                        case 5:
                                                            migratedPair = _j.sent();
                                                            _a = chai_1.expect;
                                                            return [4 /*yield*/, migratedPair.balanceOf(account.address)];
                                                        case 6:
                                                            _a.apply(void 0, [_j.sent()]).to.equal(0);
                                                            return [4 /*yield*/, migrationRouter.connect(account).migrateLiquidity(pairAddress, toPairAddress, account.address, liquidityAmount, (0, utils_1.getDeadline)())];
                                                        case 7:
                                                            _j.sent();
                                                            _b = chai_1.expect;
                                                            return [4 /*yield*/, migratedPair.balanceOf(account.address)];
                                                        case 8:
                                                            _b.apply(void 0, [_j.sent()]).to.gt(0);
                                                            _c = utils_1.getTokenContract;
                                                            return [4 /*yield*/, migratedPair.token0()];
                                                        case 9: return [4 /*yield*/, _c.apply(void 0, [_j.sent()])];
                                                        case 10:
                                                            token0 = _j.sent();
                                                            _d = utils_1.getTokenContract;
                                                            return [4 /*yield*/, migratedPair.token1()];
                                                        case 11: return [4 /*yield*/, _d.apply(void 0, [_j.sent()])];
                                                        case 12:
                                                            token1 = _j.sent();
                                                            _e = chai_1.expect;
                                                            return [4 /*yield*/, token0.balanceOf(migrationRouter.address)];
                                                        case 13:
                                                            _e.apply(void 0, [_j.sent()]).to.equal(0);
                                                            _f = chai_1.expect;
                                                            return [4 /*yield*/, token1.balanceOf(migrationRouter.address)];
                                                        case 14:
                                                            _f.apply(void 0, [_j.sent()]).to.equal(0);
                                                            _g = chai_1.expect;
                                                            return [4 /*yield*/, migratedPair.balanceOf(migrationRouter.address)];
                                                        case 15:
                                                            _g.apply(void 0, [_j.sent()]).to.equal(0);
                                                            _h = chai_1.expect;
                                                            return [4 /*yield*/, fromPairContract.balanceOf(migrationRouter.address)];
                                                        case 16:
                                                            _h.apply(void 0, [_j.sent()]).to.equal(0);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        });
                                        it("Can compute accurately chargeback from PNG-".concat(tokenSymbol), function () {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var pairAddress, toPairAddress, migrator, liquidityAmount, toPairContract, _a, chargeBack0, chargeBack1, token0, _b, token1, _c, previousBalance0, previousBalance1, tokenContract, _d, _e, _f, balance0, balance1, expectedChargeBack0, expectedChargeBack1;
                                                return __generator(this, function (_g) {
                                                    switch (_g.label) {
                                                        case 0:
                                                            pairAddress = fixture_1.default.Pairs.AVAX[tokenSymbol];
                                                            toPairAddress = fixture_1.default.Pairs.Migrated.AVAX[tokenSymbol];
                                                            migrator = fixture_1.default.Migrators[tokenSymbol];
                                                            return [4 /*yield*/, migrationRouter.connect(owner).addMigrator(tokenAddress, migrator)];
                                                        case 1:
                                                            _g.sent();
                                                            return [4 /*yield*/, (0, utils_1.fundLiquidityToken)(account, pairAddress, ethers_1.BigNumber.from(10).pow(20))];
                                                        case 2:
                                                            liquidityAmount = _g.sent();
                                                            return [4 /*yield*/, (0, utils_1.getPairContract)(toPairAddress)
                                                                // reads the chargeback
                                                            ];
                                                        case 3:
                                                            toPairContract = _g.sent();
                                                            return [4 /*yield*/, migrationRouter.calculateChargeBack(pairAddress, toPairAddress, liquidityAmount)
                                                                // reads the previous balance to compute the real charge back
                                                            ];
                                                        case 4:
                                                            _a = _g.sent(), chargeBack0 = _a[0], chargeBack1 = _a[1];
                                                            _b = utils_1.getTokenContract;
                                                            return [4 /*yield*/, toPairContract.token0()];
                                                        case 5: return [4 /*yield*/, _b.apply(void 0, [_g.sent()])];
                                                        case 6:
                                                            token0 = _g.sent();
                                                            _c = utils_1.getTokenContract;
                                                            return [4 /*yield*/, toPairContract.token1()];
                                                        case 7: return [4 /*yield*/, _c.apply(void 0, [_g.sent()])];
                                                        case 8:
                                                            token1 = _g.sent();
                                                            return [4 /*yield*/, token0.balanceOf(account.address)];
                                                        case 9:
                                                            previousBalance0 = _g.sent();
                                                            return [4 /*yield*/, token1.balanceOf(account.address)];
                                                        case 10:
                                                            previousBalance1 = _g.sent();
                                                            return [4 /*yield*/, (0, utils_1.getTokenContract)(pairAddress)];
                                                        case 11:
                                                            tokenContract = _g.sent();
                                                            return [4 /*yield*/, tokenContract.connect(account).approve(migrationRouter.address, hardhat_1.ethers.constants.MaxUint256)];
                                                        case 12:
                                                            _g.sent();
                                                            _d = chai_1.expect;
                                                            return [4 /*yield*/, tokenContract.balanceOf(account.address)];
                                                        case 13:
                                                            _d.apply(void 0, [_g.sent()]).to.equal(liquidityAmount);
                                                            _e = chai_1.expect;
                                                            return [4 /*yield*/, toPairContract.balanceOf(account.address)];
                                                        case 14:
                                                            _e.apply(void 0, [_g.sent()]).to.equal(0);
                                                            return [4 /*yield*/, migrationRouter.connect(account).migrateLiquidity(pairAddress, toPairAddress, account.address, liquidityAmount, (0, utils_1.getDeadline)())];
                                                        case 15:
                                                            _g.sent();
                                                            _f = chai_1.expect;
                                                            return [4 /*yield*/, toPairContract.balanceOf(account.address)];
                                                        case 16:
                                                            _f.apply(void 0, [_g.sent()]).to.gt(0);
                                                            return [4 /*yield*/, token0.balanceOf(account.address)];
                                                        case 17:
                                                            balance0 = _g.sent();
                                                            return [4 /*yield*/, token1.balanceOf(account.address)];
                                                        case 18:
                                                            balance1 = _g.sent();
                                                            expectedChargeBack0 = balance0.gte(previousBalance0) ? balance0.sub(previousBalance0) : previousBalance0.sub(balance0);
                                                            expectedChargeBack1 = balance1.gte(previousBalance1) ? balance1.sub(previousBalance1) : previousBalance1.sub(balance1);
                                                            (0, chai_1.expect)(chargeBack0).to.equal(expectedChargeBack0);
                                                            (0, chai_1.expect)(chargeBack1).to.equal(expectedChargeBack1);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        });
                                    };
                                    for (_i = 0, _a = Object.keys(fixture_1.default.Migrators); _i < _a.length; _i++) {
                                        tokenSymbol = _a[_i];
                                        _loop_5(tokenSymbol);
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        });
                        return [2 /*return*/];
                    });
                });
            });
            return [2 /*return*/];
        });
    });
});
