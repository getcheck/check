export interface IMetadata {
  title: string
  description?: string
  properties: IMetadataProperties
}

export type IMetadataProperties = {
  [key: string]: {
    [key: string]: unknown
    title: string
    description?: string
  }
}
