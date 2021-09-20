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

export interface IClaimType {
  hash: string
  owner: web3.PublicKey
  schema: IClaimTypeSchema
}
