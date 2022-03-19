import { IAttestation, ICredential, IRequestAttestation } from '@getcheck/types'
import { RequestAttestation } from '../requestAttestation'
import { Attestation } from '../attestation'

export class Credential implements ICredential {
  request: RequestAttestation
  attestation: Attestation

  constructor(args: ICredential) {
    this.request = RequestAttestation.fromRequest(args.request)
    this.attestation = Attestation.fromAttestation(args.attestation)
  }

  get hash(): string {
    return this.attestation.claimHash
  }

  get claimProperties(): Set<string> {
    return new Set(Object.keys(this.request.claim.contents))
  }

  static fromRequestAndAttestation(
    request: IRequestAttestation,
    attestation: IAttestation,
  ): Credential {
    return new Credential({
      request,
      attestation,
    })
  }

  static verify(input: ICredential): boolean {
    if (input.request.claim.claimTypeHash !== input.attestation.claimTypeHash) {
      return false
    }

    return (
      input.request.rootHash === input.attestation.claimHash &&
      RequestAttestation.verify(input.request)
    )
  }

  verify(): boolean {
    return Credential.verify(this)
  }

  present(disclosedClaimProperties: string[]): Credential {
    const credential = new Credential({ ...this })
    const excludedClaimProperties = Array.from(this.claimProperties).filter(
      (property) => !disclosedClaimProperties.includes(property),
    )

    credential.request.removeClaimProperties(excludedClaimProperties)

    return credential
  }
}
