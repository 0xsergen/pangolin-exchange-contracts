/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface TestPangolinV2SwapPayInterface extends ethers.utils.Interface {
  functions: {
    "swap(address,address,bool,uint160,int256,uint256,uint256)": FunctionFragment;
    "PangolinV2SwapCallback(int256,int256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "swap",
    values: [
      string,
      string,
      boolean,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "PangolinV2SwapCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "PangolinV2SwapCallback",
    data: BytesLike
  ): Result;

  events: {};
}

export class TestPangolinV2SwapPay extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: TestPangolinV2SwapPayInterface;

  functions: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "swap(address,address,bool,uint160,int256,uint256,uint256)"(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    PangolinV2SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  swap(
    pool: string,
    recipient: string,
    zeroForOne: boolean,
    sqrtPriceX96: BigNumberish,
    amountSpecified: BigNumberish,
    pay0: BigNumberish,
    pay1: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "swap(address,address,bool,uint160,int256,uint256,uint256)"(
    pool: string,
    recipient: string,
    zeroForOne: boolean,
    sqrtPriceX96: BigNumberish,
    amountSpecified: BigNumberish,
    pay0: BigNumberish,
    pay1: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  PangolinV2SwapCallback(
    arg0: BigNumberish,
    arg1: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "PangolinV2SwapCallback(int256,int256,bytes)"(
    arg0: BigNumberish,
    arg1: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "swap(address,address,bool,uint160,int256,uint256,uint256)"(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    PangolinV2SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "swap(address,address,bool,uint160,int256,uint256,uint256)"(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    PangolinV2SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "swap(address,address,bool,uint160,int256,uint256,uint256)"(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    PangolinV2SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}