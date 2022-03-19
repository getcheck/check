import {
  Hash,
  IAttestation,
  IClaimType,
  IRequestAttestation,
  IAttestationAccount,
  RecordResult,
} from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import { findAttestationPDA } from './utils'
import context from '../context'
import { Crypto } from '../utils'
import { findClaimTypePDA } from '../claimType'

export class Attestation implements IAttestation {
  claimHash: Hash
  claimTypeHash: IClaimType['hash']
  issuer: IAttestation['issuer']
  revoked: boolean

  constructor(args: IAttestation) {
    Object.assign(this, args)
  }

  static fromAttestation(input: IAttestation): Attestation {
    return new Attestation(input)
  }

  static fromAccount({
    claimHash,
    claimTypeHash,
    issuer,
    revoked,
  }: IAttestationAccount): Attestation {
    return new Attestation({
      claimHash: Crypto.u8aToHex(claimHash),
      claimTypeHash: Crypto.u8aToHex(claimTypeHash),
      issuer,
      revoked,
    })
  }

  static fromRequestAndIssuer(
    { rootHash, claim }: IRequestAttestation,
    issuer: web3.PublicKey,
  ): Attestation {
    return new Attestation({
      claimHash: rootHash,
      claimTypeHash: claim.claimTypeHash,
      issuer,
      revoked: false,
    })
  }

  static async fetchAccount(publicKey: web3.PublicKey): Promise<IAttestationAccount> {
    return (await context.program.account.attestation.fetch(publicKey)) as IAttestationAccount
  }

  static async fetch(publicKey: web3.PublicKey): Promise<Attestation> {
    const account = await Attestation.fetchAccount(publicKey)
    return Attestation.fromAccount(account)
  }

  async getPDA() {
    return findAttestationPDA(this.issuer, Crypto.hexToU8a(this.claimHash))
  }

  async record(): Promise<RecordResult> {
    const claimHash = Crypto.hexToU8a(this.claimHash)
    const [attestation, bump] = await this.getPDA()
    const [claimType] = await findClaimTypePDA(Crypto.hexToU8a(this.claimTypeHash))

    const signature = await context.program.rpc.addAttestation(claimHash, bump, {
      accounts: {
        attestation,
        claimType,
        issuer: this.issuer,
        systemProgram: web3.SystemProgram.programId,
      },
    })

    return {
      signature,
      publicKey: attestation,
    }
  }
}

export * from './utils'
