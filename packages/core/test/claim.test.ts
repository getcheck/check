import Check, { Claim, ClaimType } from '../src'
import { claimContents, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('claim', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)

  beforeAll(async () => {
    Check.init(provider, wallet)
  })

  test('fromContents', async () => {
    const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)

    expect(claim.claimTypeHash).toBe(claimType.hash)
  })
})
