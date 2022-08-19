import { DidServiceProperties, DidVerificationMethod, DidUrl } from '@getcheck/types'

export type DidDocument = {
  id: DidUrl
  controller?: DidUrl | Array<DidUrl>
  verificationMethod?: Array<DidVerificationMethod>
  authentication?: Array<DidUrl | DidVerificationMethod>
  assertionMethod?: Array<DidUrl | DidVerificationMethod>
  keyAgreement?: Array<DidUrl | DidVerificationMethod>
  capabilityInvocation?: Array<DidUrl | DidVerificationMethod>
  capabilityDelegation?: Array<DidUrl | DidVerificationMethod>
  service?: Array<DidServiceProperties>
}
