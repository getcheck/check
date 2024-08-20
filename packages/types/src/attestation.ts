import { web3 } from '@coral-xyz/anchor'
import { IClaimType } from './claimType'
import { Hash } from './crypto'

export interface IAttestation {
  claimHash: Hash
  claimTypeHash: IClaimType['hash']
  issuer: web3.PublicKey
  claimer: web3.PublicKey
  revoked: boolean
}
