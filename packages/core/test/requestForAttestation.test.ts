import Check, { Claim, ClaimType, RequestAttestation } from '../src'
import { claimContents, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('requestAttestation', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)
  const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)

  beforeAll(async () => {
    Check.init(provider, wallet)
  })

  test('fromClaim', async () => {
    const request = await RequestAttestation.fromClaim(claim)

    expect(request.claimNonceMap).toHaveProperty(
      '0x2f88a0dc95b13c293db158539303fa7127036398e33afaaa3cffb034807ea7d8',
    )
  })
})
