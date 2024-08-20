import { web3 } from '@coral-xyz/anchor'

export type RecordResult = {
  signature: web3.TransactionSignature
  publicKey: web3.PublicKey
}

export interface IAttestationAccount {
  claimType: web3.PublicKey
  claimHash: Uint8Array
  issuer: web3.PublicKey
  revoked: boolean
}

export interface IClaimTypeAccount {
  hash: Uint8Array
  owner: web3.PublicKey
}
