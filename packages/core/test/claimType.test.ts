import Check, { ClaimType } from '../src'
import { schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('claimType', () => {
  beforeAll(async () => {
    Check.init(provider, wallet)
  })

  test('fromSchema', async () => {
    const claimType = ClaimType.fromSchema(schema, payer.publicKey)

    expect(claimType.schema.$id).toBe(
      'check:type:0xf2e2c789a492ca016e996cdc203348e04849e81149c802d5163bb0a9c074e76a',
    )
  })
})
