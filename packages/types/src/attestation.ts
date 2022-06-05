import { web3 } from '@project-serum/anchor'
import { IClaimType } from './claimType'
import { Hash } from './crypto'

export interface IAttestation {
  claimHash: Hash
  claimTypeHash: IClaimType['hash']
  issuer: web3.PublicKey
  claimer: web3.PublicKey
  revoked: boolean
}
