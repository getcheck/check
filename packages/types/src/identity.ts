import { web3 } from '@project-serum/anchor'

export type PublicKey = web3.PublicKey
export type BoxPublicKey = Uint8Array

export interface IIdentity {
  pubkey: PublicKey
  boxPubkey: BoxPublicKey
}
