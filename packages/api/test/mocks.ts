import { ClaimTypeSchemaWithoutId } from '@getcheck/types'

export const schema: ClaimTypeSchemaWithoutId = {
  $schema: 'http://getcheck.dev/draft-01/claim-type#',
  title: 'Claim type schema',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  type: 'object',
}
