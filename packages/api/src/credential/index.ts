import { IAttestation, ICredential, IRequestForAttestation } from '@getcheck/types'
import { RequestForAttestation } from '../requestForAttestation'
import { Attestation } from '../attestation'

export class Credential implements ICredential {
  request: RequestForAttestation
  attestation: Attestation

  constructor(args: ICredential) {
    this.request = RequestForAttestation.fromRequest(args.request)
    this.attestation = Attestation.fromAttestation(args.attestation)
  }

  static fromRequestAndAttestation(
    request: IRequestForAttestation,
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
      RequestForAttestation.verify(input.request)
    )
  }

  get hash(): string {
    return this.attestation.claimHash
  }

  get claimProperties(): Set<string> {
    return new Set(Object.keys(this.request.claim.contents))
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
