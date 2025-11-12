import { namehash, type Address } from '../../node_modules/viem/_types'

export const getReverseNode = (address: Address) =>
  `${address.slice(2)}.addr.reverse`

export const getReverseNodeHash = (address: Address) =>
  namehash(getReverseNode(address))
