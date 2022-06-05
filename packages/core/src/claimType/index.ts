import {
  ClaimTypeSchemaWithoutId,
  IClaimType,
  IClaimTypeAccount,
  RecordResult,
} from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import context from '../context'
import { Crypto } from '../utils'
import { findClaimTypePDA, getHashForSchema, getIdForSchema } from './utils'

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

  static async fetchAccount(publicKey: web3.PublicKey): Promise<IClaimTypeAccount> {
    return (await context.program.account.claimType.fetch(
      publicKey,
    )) as unknown as IClaimTypeAccount
  }

  async getPDA() {
    return findClaimTypePDA(Crypto.hexToU8a(this.hash))
  }

  async record(): Promise<RecordResult> {
    const hash = Crypto.hexToU8a(this.hash)
    const [claimType, bump] = await this.getPDA()
    const wallet = context.wallet

    const signature = await context.program.methods
      .addClaimType([...hash], bump)
      .accounts({
        claimType,
        payer: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    return {
      signature,
      publicKey: claimType,
    }
  }
}

export * from './schema'
export * from './utils'
