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

interface TestPangolinV2RouterInterface extends ethers.utils.Interface {
  functions: {
    "swapForExact0Multi(address,address,address,uint256)": FunctionFragment;
    "swapForExact1Multi(address,address,address,uint256)": FunctionFragment;
    "PangolinV2SwapCallback(int256,int256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "swapForExact0Multi",
    values: [string, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapForExact1Multi",
    values: [string, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "PangolinV2SwapCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "swapForExact0Multi",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapForExact1Multi",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PangolinV2SwapCallback",
    data: BytesLike
  ): Result;

  events: {
    "SwapCallback(int256,int256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SwapCallback"): EventFragment;
}

export class TestPangolinV2Router extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: TestPangolinV2RouterInterface;

  functions: {
    swapForExact0Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "swapForExact0Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    swapForExact1Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "swapForExact1Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    PangolinV2SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  swapForExact0Multi(
    recipient: string,
    poolInput: string,
    poolOutput: string,
    amount0Out: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "swapForExact0Multi(address,address,address,uint256)"(
    recipient: string,
    poolInput: string,
    poolOutput: string,
    amount0Out: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  swapForExact1Multi(
    recipient: string,
    poolInput: string,
    poolOutput: string,
    amount1Out: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "swapForExact1Multi(address,address,address,uint256)"(
    recipient: string,
    poolInput: string,
    poolOutput: string,
    amount1Out: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  PangolinV2SwapCallback(
    amount0Delta: BigNumberish,
    amount1Delta: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "PangolinV2SwapCallback(int256,int256,bytes)"(
    amount0Delta: BigNumberish,
    amount1Delta: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    swapForExact0Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "swapForExact0Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    swapForExact1Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "swapForExact1Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    PangolinV2SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    SwapCallback(amount0Delta: null, amount1Delta: null): EventFilter;
  };

  estimateGas: {
    swapForExact0Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "swapForExact0Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    swapForExact1Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "swapForExact1Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    PangolinV2SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    swapForExact0Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "swapForExact0Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount0Out: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    swapForExact1Multi(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "swapForExact1Multi(address,address,address,uint256)"(
      recipient: string,
      poolInput: string,
      poolOutput: string,
      amount1Out: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    PangolinV2SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "PangolinV2SwapCallback(int256,int256,bytes)"(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}