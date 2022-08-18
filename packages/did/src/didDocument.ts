import { Did } from './did'
import { DidUrl } from './didUrl'
import { DidVerificationMethod } from './didVerificationMethod'
import { DidServiceProperties } from './didServiceProperties'

export type DidDocument = {
  id: Did
  controller?: Did | Array<Did>
  verificationMethod?: Array<DidVerificationMethod>
  authentication?: Array<DidUrl | DidVerificationMethod>
  assertionMethod?: Array<DidUrl | DidVerificationMethod>
  keyAgreement?: Array<DidUrl | DidVerificationMethod>
  capabilityInvocation?: Array<DidUrl | DidVerificationMethod>
  capabilityDelegation?: Array<DidUrl | DidVerificationMethod>
  service?: Array<DidServiceProperties>
}
