import { ClaimProof, Hash, PartialClaim } from '@getcheck/types'
import { getIdForClaimTypeHash } from '../claimType'
import { Crypto } from '../utils'

const VC_VOCAB = 'https://www.w3.org/2018/credentials#'

const jsonLDContents = (claim: PartialClaim): Record<string, unknown> => {
  const { claimTypeHash, contents, owner } = claim
  if (!claimTypeHash) {
    throw new Error('Claim type hash not provided')
  }

  const vocabulary = `${getIdForClaimTypeHash(claimTypeHash)}#`
  const res = Object.entries(contents || {}).reduce(
    (prev, [key, value]) => ({ ...prev, [vocabulary + key]: value }),
    {},
  )

  if (owner) {
    res['@id'] = `did:check:${owner}`
  }

  return res
}

export const toJsonLD = (claim: PartialClaim): Record<string, unknown> => {
  const credentialSubject = jsonLDContents(claim)
  const prefix = VC_VOCAB
  const res = {
    [`${prefix}credentialSubject`]: credentialSubject,
  }

  res[`${prefix}credentialSchema`] = {
    '@id': getIdForClaimTypeHash(claim.claimTypeHash),
  }

  return res
}

export const makeStatementsJsonLD = (claim: PartialClaim): string[] => {
  const normalized = jsonLDContents(claim)
  return Object.entries(normalized).map(([key, value]) => JSON.stringify({ [key]: value }))
}

export const verifyDisclosedClaimProperties = (claim: PartialClaim, proof: ClaimProof) => {
  const { nonceMap, hashes: proofHashes } = proof
  const statements = makeStatementsJsonLD(claim)
  const hashedStatements = Crypto.hashStatements(statements, nonceMap)
  const proofDigests = Object.keys(nonceMap)

  for (const { statement, digest, nonce, salted } of hashedStatements) {
    if (!proofDigests.includes(digest) || !nonce) {
      throw new Error(`No proof for statement: ${statement}`)
    }

    if (!proofHashes.includes(salted)) {
      throw new Error(`Ivalid proof for statement: ${statement}`)
    }
  }

  return true
}

export const hashClaimContents = (
  claim: PartialClaim,
  nonceMap?: Record<Hash, string>,
): ClaimProof => {
  const statements = makeStatementsJsonLD(claim)
  const hashedStatements = Crypto.hashStatements(statements, nonceMap)

  const hashes = hashedStatements
    .map(({ salted }) => salted)
    .sort((a, b) => Crypto.hexToBN(a).cmp(Crypto.hexToBN(b)))

  return {
    hashes,
    nonceMap: hashedStatements.reduce((prev, { digest, nonce, statement }) => {
      if (!nonce) {
        throw new Error(`Claim nonce map malformed: ${statement}`)
      }
      return { ...prev, [digest]: nonce }
    }, {}),
  }
}
