import { web3 } from '@coral-xyz/anchor'

export const isString = (value: unknown): value is string | string => {
  return typeof value === 'string' || value instanceof String
}

const HEX_REGEX = /^0x[a-fA-F0-9]+$/
export const isHex = (value: unknown, bitLength = -1, ignoreLength = false) => {
  return typeof value === 'string' && (value === '0x' || HEX_REGEX.test(value))
    ? bitLength === -1
      ? value.length % 2 === 0 || ignoreLength
      : value.length === 2 + Math.ceil(bitLength / 4)
    : false
}

export const isVersionedTransaction = (
  tx: web3.Transaction | web3.VersionedTransaction,
): tx is web3.VersionedTransaction => {
  return 'version' in tx
}
