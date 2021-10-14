import { Hash, IClaim, ICredential, IRequestForAttestation } from '@getcheck/types'
import context from '../context'
import { hashClaimContents, verifyDisclosedClaimProperties } from '../claim'
import { Crypto } from '../utils'
import { getHashLeaves, getHashRoot, verifyClaimerSignature } from './utils'

export class RequestForAttestation implements IRequestForAttestation {
  claim: IClaim
  claimNonceMap: IRequestForAttestation['claimNonceMap']
  claimHashes: IRequestForAttestation['claimHashes']
  claimerSignature: string
  legitimations: ICredential[]
  rootHash: Hash

  constructor(args: IRequestForAttestation) {
    Object.assign(this, args)

    this.verifySignature()
    this.verify()
  }

  static fromRequest(input: IRequestForAttestation): RequestForAttestation {
    return new RequestForAttestation(input)
  }

  static async fromClaim(
    claim: IClaim,
    legitimations?: ICredential[],
  ): Promise<RequestForAttestation> {
    const wallet = context.wallet

    if (!claim.owner.equals(wallet.publicKey)) {
      throw new Error('Owner mismatch')
    }

    const { hashes: claimHashes, nonceMap: claimNonceMap } = hashClaimContents(claim)

    const rootHash = RequestForAttestation.computeRootHash({
      claimHashes,
      legitimations,
    })

    const claimerSignature = await Crypto.signStr(rootHash, wallet)

    return new RequestForAttestation({
      claim,
      legitimations: legitimations || [],
      claimHashes,
      claimNonceMap,
      rootHash,
      claimerSignature,
    })
  }

  static computeRootHash(input: Partial<IRequestForAttestation>): Hash {
    const hashes: Uint8Array[] = getHashLeaves(input.claimHashes, input.legitimations)
    return getHashRoot(hashes)
  }

  static verifyRootHash(input: IRequestForAttestation): boolean {
    return input.rootHash === RequestForAttestation.computeRootHash(input)
  }

  static verifySignature(input: IRequestForAttestation): boolean {
    return verifyClaimerSignature(input)
  }

  static verify(input: IRequestForAttestation): boolean {
    if (!RequestForAttestation.verifyRootHash(input)) {
      throw new Error('Root hash unverifiable')
    }
    if (!RequestForAttestation.verifySignature(input)) {
      throw new Error('Signature unverifiable')
    }

    verifyDisclosedClaimProperties(input.claim, {
      nonceMap: input.claimNonceMap,
      hashes: input.claimHashes,
    })

    // TODO: verify legitimations

    return true
  }

  removeClaimProperties(properties: string[]) {
    properties.forEach((key) => {
      delete this.claim.contents[key]
    })
    // Update nonce map
    this.claimNonceMap = hashClaimContents(this.claim, this.claimNonceMap).nonceMap
  }

  verifySignature(): boolean {
    return RequestForAttestation.verifySignature(this)
  }

  verify(): boolean {
    return RequestForAttestation.verify(this)
  }
}
