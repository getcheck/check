import { Did } from './did'
import { DidUrl } from './didUrl'

export type DidVerificationMethod = {
  id: DidUrl
  controller: Did
  type: string
  publicKeyJwk?: string
  publicKeyMultibase?: string
}
