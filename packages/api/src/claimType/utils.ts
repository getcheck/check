import { ClaimTypeSchemaWithoutId } from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import Ajv from 'ajv'
import context from '../context'
import { Crypto } from '../utils'
import { claimTypeSchema } from './schema'

export const CLAIM_TYPE_PREFIX = 'claim_type'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}: ClaimTypeSchemaWithoutId): string => Crypto.hashObjAsStr({ $schema, properties, title, type })

export const getIdForClaimTypeHash = (hash: string): string => {
  return `check:type:${hash}`
}

export const getIdForSchema = (schema: ClaimTypeSchemaWithoutId): string => {
  return getIdForClaimTypeHash(getHashForSchema(schema))
}

export const findClaimTypePDA = async (hash: Buffer | Uint8Array) => {
  return web3.PublicKey.findProgramAddress(
    [Buffer.from(CLAIM_TYPE_PREFIX), hash],
    context.program.programId,
  )
}
