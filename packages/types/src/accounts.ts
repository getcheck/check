import { web3 } from '@project-serum/anchor'

export type RecordResult = {
  signature: web3.TransactionSignature
  pubkey: web3.PublicKey
}

export interface IAttestationAccount {
  claimType: web3.PublicKey
  claimTypeHash: Uint8Array
  claimHash: Uint8Array
  issuer: web3.PublicKey
  revoked: boolean
}

export interface IClaimTypeAccount {
  hash: Uint8Array
  owner: web3.PublicKey
}
