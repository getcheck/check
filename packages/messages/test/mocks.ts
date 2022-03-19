import { Identity, SeedWallet } from '@getcheck/core'
import { ClaimContents, ClaimTypeSchemaWithoutId } from '@getcheck/types'
import { web3 } from '@project-serum/anchor'

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

export const receiver = web3.Keypair.generate()
export const receiverWallet = new SeedWallet(receiver)
export const receiverIdentity = Identity.fromKeypair(receiver)
