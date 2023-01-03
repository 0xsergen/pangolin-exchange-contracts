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
exports.checkDust = exports.getDeadline = exports.fundLiquidityToken = exports.fundToken = exports.fundWAVAX = exports.getWAVAXContract = exports.getPairContract = exports.getTokenContract = exports.getAmountOut = exports.makeAccountGenerator = exports.getOwnerAccount = void 0;
var chai_1 = require("chai");
var ethers_1 = require("ethers");
var hardhat_1 = require("hardhat");
var fixture_1 = __importDefault(require("./fixture"));
function getOwnerAccount() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
}
exports.getOwnerAccount = getOwnerAccount;
function makeAccountGenerator() {
    return __awaiter(this, void 0, void 0, function () {
        function nextAccount() {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, accounts[index % accounts.length]];
                    case 2:
                        _a.sent();
                        index++;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        }
        var accounts, newNextAccountGen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()
                    //removes the default owner, which is accounts[0]
                ];
                case 1:
                    accounts = _a.sent();
                    //removes the default owner, which is accounts[0]
                    accounts.splice(0, 1);
                    newNextAccountGen = nextAccount();
                    return [2 /*return*/, function () { return newNextAccountGen.next().value; }];
            }
        });
    });
}
exports.makeAccountGenerator = makeAccountGenerator;
function getAmountOut(amountIn, reserveIn, reserveOut) {
    var amountInWithFee = amountIn.mul(997);
    var numerator = amountInWithFee.mul(reserveOut);
    var denominator = reserveIn.mul(1000).add(amountInWithFee);
    return numerator.div(denominator);
}
exports.getAmountOut = getAmountOut;
function getTokenContract(tokenAddress) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractAt("IPangolinERC20", tokenAddress)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getTokenContract = getTokenContract;
function getPairContract(pairAddress) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractAt("IPangolinPair", pairAddress)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPairContract = getPairContract;
function getWAVAXContract() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractAt("IWAVAX", fixture_1.default.Tokens.WAVAX)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getWAVAXContract = getWAVAXContract;
function fundWAVAX(account, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var WAVAX, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getWAVAXContract()];
                case 1:
                    WAVAX = _b.sent();
                    return [4 /*yield*/, WAVAX.connect(account).deposit({ value: amount })];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, WAVAX.balanceOf(account.address)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).to.gte(amount);
                    return [2 /*return*/];
            }
        });
    });
}
exports.fundWAVAX = fundWAVAX;
function fundToken(account, tokenToFund, amountAvax) {
    return __awaiter(this, void 0, void 0, function () {
        var WAVAX, tokenContract, tokenSymbol, pairAddress, fundPairContract, _a, reserves0, reserves1, token0, _b, amountOut0, amountOut1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractAt("IWAVAX", fixture_1.default.Tokens.WAVAX)
                    //we're already funded in this case
                ];
                case 1:
                    WAVAX = _e.sent();
                    //we're already funded in this case
                    if (tokenToFund == WAVAX.address)
                        return [2 /*return*/, amountAvax];
                    return [4 /*yield*/, getTokenContract(tokenToFund)];
                case 2:
                    tokenContract = _e.sent();
                    return [4 /*yield*/, tokenContract.symbol()];
                case 3:
                    tokenSymbol = _e.sent();
                    if (!(tokenSymbol in fixture_1.default.Pairs.AVAX))
                        throw "No valid pair for AVAX-".concat(tokenSymbol, " required to fund the account with 1INCH from WAVAX");
                    pairAddress = fixture_1.default.Pairs.AVAX[tokenSymbol];
                    return [4 /*yield*/, hardhat_1.ethers.getContractAt("IPangolinPair", pairAddress)];
                case 4:
                    fundPairContract = _e.sent();
                    return [4 /*yield*/, fundPairContract.getReserves()];
                case 5:
                    _a = _e.sent(), reserves0 = _a[0], reserves1 = _a[1];
                    return [4 /*yield*/, fundPairContract.token0()];
                case 6:
                    token0 = _e.sent();
                    if (token0 != fixture_1.default.Tokens.WAVAX)
                        _c = [reserves1, reserves0], reserves0 = _c[0], reserves1 = _c[1];
                    _b = chai_1.expect;
                    return [4 /*yield*/, WAVAX.balanceOf(account.address)];
                case 7:
                    _b.apply(void 0, [_e.sent()]).to.gte(amountAvax);
                    return [4 /*yield*/, WAVAX.connect(account).transfer(fundPairContract.address, amountAvax)];
                case 8:
                    _e.sent();
                    amountOut0 = ethers_1.BigNumber.from(0);
                    amountOut1 = getAmountOut(amountAvax, reserves0, reserves1);
                    if (token0 != fixture_1.default.Tokens.WAVAX)
                        _d = [amountOut1, amountOut0], amountOut0 = _d[0], amountOut1 = _d[1];
                    (0, chai_1.expect)(amountOut0.add(amountOut1), "Not enough AVAX used, value is 0 due to rounding issues, use a bigger amountAvax").to.not.equal(0);
                    return [4 /*yield*/, fundPairContract.connect(account).swap(amountOut0, amountOut1, account.address, [])];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, tokenContract.balanceOf(account.address)];
                case 10: return [2 /*return*/, _e.sent()];
            }
        });
    });
}
exports.fundToken = fundToken;
function fundLiquidityToken(account, pairAddress, amountAvax) {
    return __awaiter(this, void 0, void 0, function () {
        var pairContract, pairToken0, _a, pairToken1, _b, amountToken0, amountToken1, _c, _d, liquidityAmount;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, getPairContract(pairAddress)];
                case 1:
                    pairContract = _e.sent();
                    return [4 /*yield*/, fundWAVAX(account, amountAvax)];
                case 2:
                    _e.sent();
                    _a = getTokenContract;
                    return [4 /*yield*/, pairContract.token0()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])];
                case 4:
                    pairToken0 = _e.sent();
                    _b = getTokenContract;
                    return [4 /*yield*/, pairContract.token1()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])];
                case 6:
                    pairToken1 = _e.sent();
                    return [4 /*yield*/, fundToken(account, pairToken0.address, amountAvax.div(2))];
                case 7:
                    amountToken0 = _e.sent();
                    return [4 /*yield*/, fundToken(account, pairToken1.address, amountAvax.div(2))];
                case 8:
                    amountToken1 = _e.sent();
                    _c = chai_1.expect;
                    return [4 /*yield*/, pairToken0.balanceOf(account.address)];
                case 9:
                    _c.apply(void 0, [_e.sent()]).to.gte(amountToken0);
                    _d = chai_1.expect;
                    return [4 /*yield*/, pairToken1.balanceOf(account.address)];
                case 10:
                    _d.apply(void 0, [_e.sent()]).to.gte(amountToken1);
                    // funds the liquidity token
                    return [4 /*yield*/, pairToken0.connect(account).transfer(pairContract.address, amountToken0)];
                case 11:
                    // funds the liquidity token
                    _e.sent();
                    return [4 /*yield*/, pairToken1.connect(account).transfer(pairContract.address, amountToken1)];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, pairContract.connect(account).mint(account.address)];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, pairContract.balanceOf(account.address)];
                case 14:
                    liquidityAmount = _e.sent();
                    (0, chai_1.expect)(liquidityAmount).to.gt(0);
                    return [2 /*return*/, liquidityAmount];
            }
        });
    });
}
exports.fundLiquidityToken = fundLiquidityToken;
function getDeadline() {
    return Math.floor(Date.now() / 1000) + 60 * 20 * 4;
}
exports.getDeadline = getDeadline;
function checkDust(tokens, addressToCheck, expectAmount) {
    return __awaiter(this, void 0, void 0, function () {
        var i, token, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < tokens.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, getTokenContract(tokens[i])];
                case 2:
                    token = _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, token.balanceOf(addressToCheck)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).to.equal(expectAmount);
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.checkDust = checkDust;
