export type DidMethodIdentifier = string

export type DidUrl = `did:check:${DidMethodIdentifier}${string}`

export type DidVerificationMethod = {
  id: DidUrl
  controller: DidUrl
  type: string
  publicKeyJwk?: string
  publicKeyMultibase?: string
}

export type DidServiceProperties = {
  id: DidUrl
  type: string | Array<string>
  serviceEndpoint: string | Map<string, string>
}
