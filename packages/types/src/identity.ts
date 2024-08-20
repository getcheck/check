import { web3 } from '@coral-xyz/anchor'

export type PublicKey = web3.PublicKey
export type BoxPublicKey = Uint8Array

export interface IIdentity {
  publicKey: PublicKey
  boxPublicKey: BoxPublicKey
}
