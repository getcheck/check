import { Hash, ICredential, IRequestForAttestation } from '@getcheck/types'
import { Crypto } from '../utils'

export const getHashLeaves = (claimHashes: Hash[], legitimations: ICredential[]): Uint8Array[] => {
  const leaves: Uint8Array[] = []

  leaves.push(...claimHashes.map((hash) => Crypto.ciToU8a(hash)))

  // TODO: legitimations hashes

  return leaves
}

export const getHashRoot = (leaves: Uint8Array[]): string => {
  return Crypto.hashAsStr(Buffer.concat(leaves))
}

export const verifyClaimerSignature = (request: IRequestForAttestation): boolean => {
  return Crypto.verify(request.rootHash, request.claimerSignature, request.claim.owner)
}
