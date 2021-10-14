import { ClaimContents, ClaimTypeSchemaWithoutId } from '@getcheck/types'

export const schema: ClaimTypeSchemaWithoutId = {
  $schema: 'http://getcheck.dev/draft-01/claim-type#',
  title: 'Passport',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  type: 'object',
}

export const claimContents: ClaimContents = { foo: 123, bar: 'abc' }
