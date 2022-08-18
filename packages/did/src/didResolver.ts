import { Did } from './did'
import { DidDocument } from './didDocument'

export type DidResolutionMetadata = {
  contentType: string
}

export type DidDocumentMetadata = {
  deactivated: boolean
}

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

export type DidResolutionOptions = {
  accept: string
}

export interface DidResolver {
  resolve(did: Did): Promise<DidResolutionResult>
  resolveRepresentation<T>(
    did: Did,
    resolutionOptions?: DidResolutionOptions,
  ): Promise<DidResolutionRepresentationResult<T>>
}
