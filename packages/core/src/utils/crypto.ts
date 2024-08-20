import { CryptoInput, EncryptedAsymmetric, EncryptedAsymmetricStr, Hash } from '@getcheck/types'
import { BN, utils, web3 } from '@coral-xyz/anchor'
import { sha256 } from 'js-sha256'
import { sortObj } from 'jsonabc'
import nacl from 'tweetnacl'
import { v4 as uuid } from 'uuid'
import { isHex, isString } from './is'

// TODO: update to another library without buffer
export const hexToU8a = (input: string) => new Uint8Array(utils.bytes.hex.decode(input))
export const hexToBN = (input: string) => new BN(hexToU8a(input))
export const u8aToHex = (input: Uint8Array) => utils.bytes.hex.encode(Buffer.from(input))
export const u8aToStr = (input: Uint8Array) => utils.bytes.utf8.decode(input)
export const strToU8a = (input: string) => utils.bytes.utf8.encode(input)

export const ciToU8a = (input: CryptoInput) => {
  return isString(input)
    ? isHex(input)
      ? hexToU8a(input)
      : strToU8a(input)
    : new Uint8Array(input)
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

export const sign = (message: CryptoInput, keypair: web3.Keypair): Uint8Array => {
  return nacl.sign.detached(ciToU8a(message), keypair.secretKey)
}

export const signStr = async (message: CryptoInput, keypair: web3.Keypair): Promise<string> => {
  const signature = await sign(message, keypair)
  return u8aToHex(signature)
}

export const verify = (
  message: CryptoInput,
  signature: CryptoInput,
  publicKey: web3.PublicKey,
): boolean => {
  return nacl.sign.detached.verify(ciToU8a(message), ciToU8a(signature), publicKey.toBytes())
}

export const createBoxKeyPair = (
  seed: Uint8Array,
  entropy = new Uint8Array([1, 2, 3]),
): nacl.BoxKeyPair => {
  const secret = hash(new Uint8Array([...seed, ...entropy]))
  return nacl.box.keyPair.fromSecretKey(secret)
}

export const encryptAsymmetric = (
  message: CryptoInput,
  publicKeyA: CryptoInput,
  secretKeyB: CryptoInput,
): EncryptedAsymmetric => {
  const nonce = nacl.randomBytes(24)
  const box = nacl.box(ciToU8a(message), nonce, ciToU8a(publicKeyA), ciToU8a(secretKeyB))
  return { box, nonce }
}

export const encryptAsymmetricAsStr = (
  message: CryptoInput,
  publicKeyA: CryptoInput,
  secretKeyB: CryptoInput,
): EncryptedAsymmetricStr => {
  const encrypted = encryptAsymmetric(message, publicKeyA, secretKeyB)
  const box: string = u8aToHex(encrypted.box)
  const nonce: string = u8aToHex(encrypted.nonce)
  return { box, nonce }
}

export const decryptAsymmetric = (
  data: EncryptedAsymmetric | EncryptedAsymmetricStr,
  publicKeyB: CryptoInput,
  secretKeyA: CryptoInput,
): Uint8Array | false => {
  const decrypted = nacl.box.open(
    ciToU8a(data.box),
    ciToU8a(data.nonce),
    ciToU8a(publicKeyB),
    ciToU8a(secretKeyA),
  )
  return decrypted || false
}

export const decryptAsymmetricAsStr = (
  data: EncryptedAsymmetric | EncryptedAsymmetricStr,
  publicKeyB: CryptoInput,
  secretKeyA: CryptoInput,
): string | false => {
  const res = decryptAsymmetric(data, publicKeyB, secretKeyA)
  return res ? u8aToStr(res) : false
}
