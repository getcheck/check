import { IAttestation } from './attestation'
import { IRequestAttestation } from './requestAttestation'

export interface ICredential {
  attestation: IAttestation
  request: IRequestAttestation
}
