import { ClaimTypeSchemaWithoutId, IClaimType } from '@getcheck/types'
import { getHashForSchema, getIdForSchema } from './utils'

export class ClaimType implements IClaimType {
  hash: IClaimType['hash']
  schema: IClaimType['schema']
  owner?: IClaimType['owner']

  constructor(args: IClaimType) {
    Object.assign(this, args)
  }

  static fromSchema(schema: ClaimTypeSchemaWithoutId, owner?: IClaimType['owner']) {
    return new ClaimType({
      hash: getHashForSchema(schema),
      schema: {
        ...schema,
        $id: getIdForSchema(schema),
      },
      owner,
    })
  }
}

export * from './utils'
export * from './schema'
