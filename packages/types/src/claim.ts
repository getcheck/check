import { web3 } from '@project-serum/anchor'
import { IClaimType } from './claimType'
import { Hash } from './crypto'

export type ClaimContents = Record<string, Record<string, unknown> | string | number | boolean>

export interface IClaim {
  claimTypeHash: IClaimType['hash']
  contents: ClaimContents
  owner: web3.PublicKey
}

export type PartialClaim = Partial<IClaim> & Pick<IClaim, 'claimTypeHash'>

export type ClaimProof = {
  hashes: Hash[]
  nonceMap: Record<Hash, string>
}
