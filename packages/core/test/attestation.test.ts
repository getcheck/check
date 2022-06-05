import Check, { Claim, ClaimType, RequestAttestation, Attestation } from '../src'
import { claimContents, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('attestation', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)
  const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)

  beforeAll(async () => {
    Check.init(provider, wallet)
  })

  test('fromRequestAndIssuer', async () => {
    const request = await RequestAttestation.fromClaim(claim)
    const attestation = Attestation.fromRequestAndIssuer(request, payer.publicKey)

    expect(attestation.claimTypeHash).toBe(claimType.hash)
  })
})
