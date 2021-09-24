import { web3 } from '@project-serum/anchor'

export interface IClaimTypeSchema {
  $id: string
  $schema: string
  title: string
  properties: {
    [key: string]: { $ref?: string; type?: string; format?: string }
  }
  type: 'object'
}

export type ClaimTypeSchemaWithoutId = Omit<IClaimTypeSchema, '$id'>

export interface IClaimType {
  hash: string
  schema: IClaimTypeSchema
  owner?: web3.PublicKey
}
