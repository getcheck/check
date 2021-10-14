import Check, { Claim, ClaimType, RequestForAttestation, Attestation, Crypto } from '../src'
import { claimContents, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('attestation', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)
  const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)

  beforeAll(async () => {
    Check.init(provider, wallet)

    try {
      const [publicKey] = await claimType.getPDA()
      await ClaimType.fetchAccount(publicKey)
    } catch (err) {
      await claimType.record()
    }
  })

  test('fromRequestAndIssuer', async () => {
    const request = await RequestForAttestation.fromClaim(claim)
    const attestation = Attestation.fromRequestAndIssuer(request, payer.publicKey)

    expect(attestation.claimTypeHash).toBe(claimType.hash)
  })

  test('record', async () => {
    const claimDirty = Claim.fromContents(
      claimType,
      { ...claimContents, foo: Math.ceil(Math.random() * 10000) },
      payer.publicKey,
    )
    const request = await RequestForAttestation.fromClaim(claimDirty)
    const attestation = Attestation.fromRequestAndIssuer(request, payer.publicKey)

    const { publicKey } = await attestation.record()

    const account = await Attestation.fetchAccount(publicKey)
    expect(new Uint8Array(account.claimHash)).toEqual(Crypto.hexToU8a(attestation.claimHash))
  })
})
