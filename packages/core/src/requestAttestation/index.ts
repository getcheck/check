import { Hash, IClaim, ICredential, IRequestAttestation } from '@getcheck/types'
import context from '../context'
import { hashClaimContents, verifyDisclosedClaimProperties } from '../claim'
import { Crypto } from '../utils'
import { getHashLeaves, getHashRoot, verifyClaimerSignature } from './utils'

export class RequestAttestation implements IRequestAttestation {
  claim: IClaim
  claimNonceMap: IRequestAttestation['claimNonceMap']
  claimHashes: IRequestAttestation['claimHashes']
  claimerSignature: string
  legitimations: ICredential[]
  rootHash: Hash

  constructor(args: IRequestAttestation) {
    Object.assign(this, args)

    this.verifySignature()
    this.verify()
  }

  static fromRequest(input: IRequestAttestation): RequestAttestation {
    return new RequestAttestation(input)
  }

  static async fromClaim(
    claim: IClaim,
    legitimations?: ICredential[],
  ): Promise<RequestAttestation> {
    const wallet = context.wallet

    if (!claim.owner.equals(wallet.publicKey)) {
      throw new Error('Owner mismatch')
    }

    const { hashes: claimHashes, nonceMap: claimNonceMap } = hashClaimContents(claim)

    const rootHash = RequestAttestation.computeRootHash({
      claimHashes,
      legitimations,
    })

    const claimerSignature = Crypto.u8aToHex(await wallet.signMessage(Crypto.ciToU8a(rootHash)))

    return new RequestAttestation({
      claim,
      legitimations: legitimations || [],
      claimHashes,
      claimNonceMap,
      rootHash,
      claimerSignature,
    })
  }

  static computeRootHash(input: Partial<IRequestAttestation>): Hash {
    const hashes: Uint8Array[] = getHashLeaves(input.claimHashes, input.legitimations)
    return getHashRoot(hashes)
  }

  static verifyRootHash(input: IRequestAttestation): boolean {
    return input.rootHash === RequestAttestation.computeRootHash(input)
  }

  static verifySignature(input: IRequestAttestation): boolean {
    return verifyClaimerSignature(input)
  }

  static verify(input: IRequestAttestation): boolean {
    if (!RequestAttestation.verifyRootHash(input)) {
      throw new Error('Root hash unverifiable')
    }
    if (!RequestAttestation.verifySignature(input)) {
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
    return RequestAttestation.verifySignature(this)
  }

  verify(): boolean {
    return RequestAttestation.verify(this)
  }
}
