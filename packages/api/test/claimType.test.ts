import Check, { ClaimType, Crypto } from '../src'
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

  test('record', async () => {
    const claimType = ClaimType.fromSchema(
      { ...schema, title: Math.random().toString() },
      payer.publicKey,
    )
    const { pubkey } = await claimType.record()

    const account = await ClaimType.fetchAccount(pubkey)
    expect(new Uint8Array(account.hash)).toEqual(Crypto.hexToU8a(claimType.hash))
  })
})
