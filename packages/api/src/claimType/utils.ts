import { ClaimTypeSchemaWithoutId } from '@getcheck/types'
import Ajv from 'ajv'
import { Crypto } from '../utils'
import { claimTypeSchema } from './schema'

export const validateSchema = (schema: Record<string, any>, data: Record<string, any>) => {
  const ajv = new Ajv()
  ajv.addMetaSchema(claimTypeSchema)
  const validate = ajv.compile(schema)
  return validate(data)
}

export const getHashForSchema = ({
  $schema,
  properties,
  title,
  type,
}: ClaimTypeSchemaWithoutId): string => Crypto.hashObj({ $schema, properties, title, type })

export const getIdForClaimTypeHash = (hash: string): string => {
  return `check:type:${hash}`
}

export const getIdForSchema = (schema: ClaimTypeSchemaWithoutId): string => {
  return getIdForClaimTypeHash(getHashForSchema(schema))
}
