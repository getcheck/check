import { Did } from './did'
import { DidDocument } from './didDocument'
import { DidResolutionMetadata } from './didResolutionMetadata'
import { DidDocumentMetadata } from './didDocumentMetadata'
import { DidResolutionOptions } from './didResolutionOptions'

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
  resolve(did: Did): Promise<DidResolutionResult>
  resolveRepresentation<T>(
    did: Did,
    resolutionOptions?: DidResolutionOptions,
  ): Promise<DidResolutionRepresentationResult<T>>
}
