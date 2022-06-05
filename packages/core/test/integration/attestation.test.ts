import Check, { Claim, ClaimType, RequestAttestation, Attestation, Crypto } from '../../src'
import { claimContents, schema } from '../mocks'
import { airdrop, payer, provider, wallet } from '../utils'

describe('attestation', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)

  beforeAll(async () => {
    Check.init(provider, wallet)

    await airdrop(wallet.publicKey)
  })

  test('record & validate', async () => {
    try {
      const [publicKey] = await claimType.getPDA()
      await ClaimType.fetchAccount(publicKey)
    } catch (err) {
      await claimType.record()
    }

    const claimDirty = Claim.fromContents(
      claimType,
      { ...claimContents, foo: Math.ceil(Math.random() * 10000) },
      payer.publicKey,
    )
    const request = await RequestAttestation.fromClaim(claimDirty)
    const attestation = Attestation.fromRequestAndIssuer(request, payer.publicKey)

    const { publicKey } = await attestation.record()

    const isValid = await attestation.validate()
    expect(isValid).toBe(true)

    const account = await Attestation.fetchAccount(publicKey)
    expect(new Uint8Array(account.claimHash)).toEqual(Crypto.hexToU8a(attestation.claimHash))
  })
})
