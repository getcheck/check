import { IClaim } from './claim'
import { ICredential } from './credential'
import { Hash } from './crypto'

export interface IRequestAttestation {
  claim: IClaim
  claimNonceMap: Record<Hash, string>
  claimHashes: Hash[]
  claimerSignature: Uint8Array
  legitimations: ICredential[]
  rootHash: Hash
}
