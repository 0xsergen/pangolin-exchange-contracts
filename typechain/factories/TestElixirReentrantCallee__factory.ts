/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { TestElixirReentrantCallee } from "../TestElixirReentrantCallee";

export class TestElixirReentrantCallee__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<TestElixirReentrantCallee> {
    return super.deploy(overrides || {}) as Promise<TestElixirReentrantCallee>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestElixirReentrantCallee {
    return super.attach(address) as TestElixirReentrantCallee;
  }
  connect(signer: Signer): TestElixirReentrantCallee__factory {
    return super.connect(signer) as TestElixirReentrantCallee__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestElixirReentrantCallee {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestElixirReentrantCallee;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "swapToReenter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "ElixirSwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610f84806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063c22a2bfe1461003b578063fa461e3314610070575b600080fd5b61006e6004803603602081101561005157600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166100ec565b005b61006e6004803603606081101561008657600080fd5b8135916020810135918101906060810160408201356401000000008111156100ad57600080fd5b8201836020820111156100bf57600080fd5b803590602001918460018302840111640100000000831117156100e157600080fd5b509092509050610212565b6040805160008082526020820192839052630251596160e31b8352602482018181526044830182905260016064840181905273fffd8963efd1fc6a506488495d951d5263988d256084850181905260a060a48601908152855160c4870181905273ffffffffffffffffffffffffffffffffffffffff89169763128acb0897879690939092909160e48501918083838b5b8381101561019457818101518382015260200161017c565b50505050905090810190601f1680156101c15780820380516001836020036101000a031916815260200191505b5096505050505050506040805180830381600087803b1580156101e357600080fd5b505af11580156101f7573d6000803e3d6000fd5b505050506040513d604081101561020d57600080fd5b505050565b6040805160008082526020820192839052630251596160e31b835260248201818152604483018290526001606484018190526084840183905260a060a48501908152845160c48601819052339663128acb0896869586949193909260e4850191808383895b8381101561028f578181015183820152602001610277565b50505050905090810190601f1680156102bc5780820380516001836020036101000a031916815260200191505b5096505050505050506040805180830381600087803b1580156102de57600080fd5b505af192505050801561030a57506040513d60408110156102fe57600080fd5b50805160209091015160015b61046d57610316610ed1565b80610321575061045e565b604051806040016040528060038152602001624c4f4b60e81b8152506040516020018080602001828103825283818151815260200191508051906020019080838360005b8381101561037d578181015183820152602001610365565b50505050905090810190601f1680156103aa5780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120816040516020018080602001828103825283818151815260200191508051906020019080838360005b838110156104065781810151838201526020016103ee565b50505050905090810190601f1680156104335780820380516001836020036101000a031916815260200191505b5092505050604051602081830303815290604052805190602001201461045857600080fd5b50610468565b3d6000803e3d6000fd5b610470565b50505b6040805160008082526020820192839052633c8a7d8d60e01b83526024820181815260448301829052606483018290526084830182905260a060a48401908152835160c485018190523395633c8a7d8d9585948594859492939192909160e4850191808383895b838110156104ef5781810151838201526020016104d7565b50505050905090810190601f16801561051c5780820380516001836020036101000a031916815260200191505b5096505050505050506040805180830381600087803b15801561053e57600080fd5b505af192505050801561056a57506040513d604081101561055e57600080fd5b50805160209091015160015b6106be57610576610ed1565b80610581575061045e565b604051806040016040528060038152602001624c4f4b60e81b8152506040516020018080602001828103825283818151815260200191508051906020019080838360005b838110156105dd5781810151838201526020016105c5565b50505050905090810190601f16801561060a5780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120816040516020018080602001828103825283818151815260200191508051906020019080838360005b8381101561066657818101518382015260200161064e565b50505050905090810190601f1680156106935780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120146106b857600080fd5b506106c1565b50505b604080516309e3d67b60e31b81526000600482018190526024820181905260448201819052606482018190526084820181905282513393634f1eb3d89360a480820194929392918390030190829087803b15801561071e57600080fd5b505af192505050801561074a57506040513d604081101561073e57600080fd5b50805160209091015160015b61089e57610756610ed1565b80610761575061045e565b604051806040016040528060038152602001624c4f4b60e81b8152506040516020018080602001828103825283818151815260200191508051906020019080838360005b838110156107bd5781810151838201526020016107a5565b50505050905090810190601f1680156107ea5780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120816040516020018080602001828103825283818151815260200191508051906020019080838360005b8381101561084657818101518382015260200161082e565b50505050905090810190601f1680156108735780820380516001836020036101000a031916815260200191505b5092505050604051602081830303815290604052805190602001201461089857600080fd5b506108a1565b50505b3373ffffffffffffffffffffffffffffffffffffffff1663a34123a760008060006040518463ffffffff1660e01b81526004018084815260200183815260200182815260200193505050506040805180830381600087803b15801561090557600080fd5b505af192505050801561093157506040513d604081101561092557600080fd5b50805160209091015160015b610a855761093d610ed1565b80610948575061045e565b604051806040016040528060038152602001624c4f4b60e81b8152506040516020018080602001828103825283818151815260200191508051906020019080838360005b838110156109a457818101518382015260200161098c565b50505050905090810190601f1680156109d15780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120816040516020018080602001828103825283818151815260200191508051906020019080838360005b83811015610a2d578181015183820152602001610a15565b50505050905090810190601f168015610a5a5780820380516001836020036101000a031916815260200191505b50925050506040516020818303038152906040528051906020012014610a7f57600080fd5b50610a88565b50505b60408051600080825260208201928390526312439b2f60e21b8352602482018181526044830182905260648301829052608060848401908152835160a48501819052339563490e6cbc95859485949193909260c4850191808383895b83811015610afc578181015183820152602001610ae4565b50505050905090810190601f168015610b295780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b158015610b4b57600080fd5b505af1925050508015610b5c575060015b610cac57610b68610ed1565b80610b73575061045e565b604051806040016040528060038152602001624c4f4b60e81b8152506040516020018080602001828103825283818151815260200191508051906020019080838360005b83811015610bcf578181015183820152602001610bb7565b50505050905090810190601f168015610bfc5780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120816040516020018080602001828103825283818151815260200191508051906020019080838360005b83811015610c58578181015183820152602001610c40565b50505050905090810190601f168015610c855780820380516001836020036101000a031916815260200191505b50925050506040516020818303038152906040528051906020012014610caa57600080fd5b505b604080516385b6672960e01b81526000600482018190526024820181905260448201819052825133936385b6672993606480820194929392918390030190829087803b158015610cfb57600080fd5b505af1925050508015610d2757506040513d6040811015610d1b57600080fd5b50805160209091015160015b610e7b57610d33610ed1565b80610d3e575061045e565b604051806040016040528060038152602001624c4f4b60e81b8152506040516020018080602001828103825283818151815260200191508051906020019080838360005b83811015610d9a578181015183820152602001610d82565b50505050905090810190601f168015610dc75780820380516001836020036101000a031916815260200191505b509250505060405160208183030381529060405280519060200120816040516020018080602001828103825283818151815260200191508051906020019080838360005b83811015610e23578181015183820152602001610e0b565b50505050905090810190601f168015610e505780820380516001836020036101000a031916815260200191505b50925050506040516020818303038152906040528051906020012014610e7557600080fd5b50610e7e565b50505b6040805162461bcd60e51b815260206004820152601160248201527f556e61626c6520746f207265656e746572000000000000000000000000000000604482015290519081900360640190fd5b60e01c90565b600060443d1015610ee157610f74565b600481823e6308c379a0610ef58251610ecb565b14610eff57610f74565b6040513d600319016004823e80513d67ffffffffffffffff8160248401118184111715610f2f5750505050610f74565b82840192508251915080821115610f495750505050610f74565b503d83016020828401011115610f6157505050610f74565b601f01601f191681016020016040529150505b9056fea164736f6c6343000706000a";