import { DidUrl } from '@getcheck/types'
import { DidDocument } from '../document'
import { DidResolutionOptions, DidDocumentMetadata, DidResolutionMetadata } from '../types'

export type DidResolutionResult = {
  didResolutionMetadata: DidResolutionMetadata
  didDocument: DidDocument
  didDocumentMetadata: DidDocumentMetadata
}

export type DidResolutionRepresentationResult<T> = {
  didResolutionMetadata: DidResolutionMetadata
  didDocumentStream: T
  didDocumentMetadata: DidDocumentMetadata
}

export interface DidResolver {
  resolve(did: DidUrl): Promise<DidResolutionResult>
  resolveRepresentation<T>(
    did: DidUrl,
    resolutionOptions?: DidResolutionOptions,
  ): Promise<DidResolutionRepresentationResult<T>>
}
