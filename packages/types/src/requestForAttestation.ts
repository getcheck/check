import { IClaim } from './claim'
import { ICredential } from './credential'
import { Hash } from './crypto'

export interface IRequestForAttestation {
  claim: IClaim
  claimNonceMap: Record<Hash, string>
  claimHashes: Hash[]
  claimerSignature: string
  legitimations: ICredential[]
  rootHash: Hash
}
