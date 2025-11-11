/**
 * ENS Controller ABI
 * Functions for domain registration with different payment methods
 */
export const CONTROLLER_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'duration',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'secret',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'resolver',
            type: 'address',
          },
          {
            internalType: 'bytes[]',
            name: 'data',
            type: 'bytes[]',
          },
          {
            internalType: 'bool',
            name: 'reverseRecord',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'ownerControlledFuses',
            type: 'uint16',
          },
        ],
        internalType: 'struct IETHRegistrarController.RegisterParams',
        name: 'registerParams',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'lifetime',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'referree',
        type: 'string',
      },
    ],
    name: 'registerWithToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'secret',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
      {
        internalType: 'bool',
        name: 'reverseRecord',
        type: 'bool',
      },
      {
        internalType: 'uint16',
        name: 'ownerControlledFuses',
        type: 'uint16',
      },
      {
        internalType: 'bool',
        name: 'lifetime',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'referree',
        type: 'string',
      },
    ],
    name: 'registerWithCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'token',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'lifetime',
        type: 'bool',
      },
    ],
    name: 'rentPriceToken',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'base',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'premium',
            type: 'uint256',
          },
        ],
        internalType: 'struct IPriceOracle.Price',
        name: 'price',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
