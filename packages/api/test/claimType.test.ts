import { Check, ClaimType } from '../src'
import { schema } from './mocks'
import { payer, provider } from './utils'

describe('claimType', () => {
  beforeAll(async () => {
    Check.init(provider)
  })

  test('from schema', async () => {
    const claimType = ClaimType.fromSchema(schema, payer.publicKey)

    expect(claimType.schema.$id).toBe(
      'check:type:6ad3ab27981bde16b874c0f343696778fa9059d7c1047d50e2f89a692e577775',
    )
  })
})
