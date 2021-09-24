import { web3 } from '@project-serum/anchor'
import { IClaimType } from './claimType'

export type PartialClaim = Partial<IClaim> & Pick<IClaim, 'claimTypeHash'>

export type IClaimContents = Record<string, Record<string, unknown> | string | number | boolean>

export interface IClaim {
  claimTypeHash: IClaimType['hash']
  contents: IClaimContents
  owner: web3.PublicKey
}
