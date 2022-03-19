import { IAttestation, IRequestAttestation } from '@getcheck/types'
import Check, { Attestation, Claim, ClaimType, Credential, RequestAttestation } from '../src'
import { claimContents, schema } from './mocks'
import { payer, provider, wallet } from './utils'

describe('credential', () => {
  const claimType = ClaimType.fromSchema(schema, payer.publicKey)
  const claim = Claim.fromContents(claimType, claimContents, payer.publicKey)
  let request: IRequestAttestation
  let attestation: IAttestation

  beforeAll(async () => {
    Check.init(provider, wallet)

    request = await RequestAttestation.fromClaim(claim)
    attestation = Attestation.fromRequestAndIssuer(request, payer.publicKey)
  })

  test('fromRequestAndAttestation', async () => {
    const credential = Credential.fromRequestAndAttestation(request, attestation)

    expect(credential.hash).toBe(attestation.claimHash)
  })

  test('present', async () => {
    const credential = Credential.fromRequestAndAttestation(request, attestation)
    const presentation = credential.present(['foo'])

    console.log(presentation)
  })
})
