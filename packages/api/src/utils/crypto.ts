import { sortObj } from 'jsonabc'
import { sha256 } from 'js-sha256'
import nacl from 'tweetnacl'
import { web3, utils, BN } from '@project-serum/anchor'
import { v4 as uuid } from 'uuid'
import { isString } from './is'
import { Hash, Wallet } from '@getcheck/types'

export type CryptoInput = string | number[] | ArrayBuffer | Uint8Array

// TODO: update to another library without buffer
export const hexToU8a = (input: string) => new Uint8Array(utils.bytes.hex.decode(input))
export const u8aToHex = (input: Uint8Array) => utils.bytes.hex.encode(Buffer.from(input))
export const hexToBN = (input: string) => new BN(hexToU8a(input))

export const ciToU8a = (input: CryptoInput) => {
  return isString(input) ? hexToU8a(input) : new Uint8Array(input)
}

export const hash = (input: CryptoInput): Uint8Array => {
  return Uint8Array.from(sha256.array(input))
}

export const hashAsStr = (input: CryptoInput): string => {
  return u8aToHex(hash(input))
}

export const hashObjAsStr = (value: Record<string, unknown>) => {
  const str = JSON.stringify(sortObj(value))
  return hashAsStr(str)
}

export const hasher = (value: string, nonce = '') => hashAsStr(nonce + value)

export type HashedStatement = {
  digest: string
  statement: string
  salted: string
  nonce: string
}
export const hashStatements = (
  statements: string[],
  nonceMap?: Record<Hash, string>,
): Array<HashedStatement> => {
  const getNonce = nonceMap ? (key: Hash) => nonceMap[key] : uuid

  return statements.map((statement) => {
    const digest = hasher(statement)
    const nonce = getNonce(digest)
    const salted = hasher(digest, nonce)

    return { digest, salted, nonce, statement }
  })
}

export const sign = (message: CryptoInput, wallet: Wallet): Promise<Uint8Array> => {
  return wallet.signMessage(ciToU8a(message))
}

export const signStr = async (message: CryptoInput, wallet: Wallet): Promise<string> => {
  const signature = await sign(message, wallet)
  return u8aToHex(signature)
}

export const verify = (
  message: CryptoInput,
  signature: CryptoInput,
  pubkey: web3.PublicKey,
): boolean => {
  return nacl.sign.detached.verify(ciToU8a(message), ciToU8a(signature), pubkey.toBytes())
}
