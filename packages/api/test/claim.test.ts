import { IClaimContents } from '@getcheck/types'
import { Check, Claim, ClaimType } from '../src'
import { schema } from './mocks'
import { payer, provider } from './utils'

describe('claim', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)

  beforeAll(async () => {
    Check.init(provider)
  })

  test('from claim type and claim contents', async () => {
    const claimContents: IClaimContents = { foo: 123, bar: 'abc' }
    const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)

    console.log(claim)
    contents: { foo: { hash: 'ddasdas', nonce: 126 }, bar: { hash: '123' } }
    contents: { foo: 123 };

    expect(claim.claimTypeHash).toBe(claimType.hash)
  })
})
