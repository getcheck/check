import { IAttestation } from './attestation'
import { IRequestForAttestation } from './requestForAttestation'

export interface ICredential {
  attestation: IAttestation
  request: IRequestForAttestation
}
