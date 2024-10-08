import { IClaim, ClaimContents, IClaimType } from '@getcheck/types'
import { web3 } from '@coral-xyz/anchor'
import { validateSchema } from '../claimType'

export class Claim implements IClaim {
  claimTypeHash: IClaim['claimTypeHash']
  contents: IClaim['contents']
  owner: IClaim['owner']

  constructor(args: IClaim) {
    Object.assign(this, args)
  }

  static fromContents(claimType: IClaimType, claimContents: ClaimContents, owner: web3.PublicKey) {
    if (!validateSchema(claimType.schema, claimContents)) {
      throw new Error('Claim not valid')
    }

    return new Claim({
      claimTypeHash: claimType.hash,
      contents: claimContents,
      owner: owner,
    })
  }
}

export * from './utils'
