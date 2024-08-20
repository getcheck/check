import { Attestation, Claim, ClaimType, Credential, RequestAttestation } from '@getcheck/core'
import { ClaimContents, ClaimTypeSchemaWithoutId } from '@getcheck/types'
import { web3 } from '@coral-xyz/anchor'

export const schema: ClaimTypeSchemaWithoutId = {
  $schema: 'http://getcheck.dev/draft-01/claim-type#',
  title: 'Passport',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  type: 'object',
}

export const claimContents: ClaimContents = { foo: 123, bar: 'abc' }

export const createCredential = async (
  payerPubkey: web3.PublicKey,
): Promise<[Credential, web3.PublicKey]> => {
  const claimType = ClaimType.fromSchema(schema, payerPubkey)

  try {
    const [publicKey] = await claimType.getPDA()
    await ClaimType.fetchAccount(publicKey)
  } catch (err) {
    await claimType.record()
  }

  const claimDirty = Claim.fromContents(
    claimType,
    { ...claimContents, foo: Math.ceil(Math.random() * 10000) },
    payerPubkey,
  )
  const request = await RequestAttestation.fromClaim(claimDirty)
  const attestation = Attestation.fromRequestAndIssuer(request, payerPubkey)
  const credential = Credential.fromRequestAndAttestation(request, attestation)
  const { publicKey } = await attestation.record()

  return [credential, publicKey]
}
