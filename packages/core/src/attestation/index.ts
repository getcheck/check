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
  claimer: IAttestation['claimer']
  revoked: boolean

  constructor(args: IAttestation) {
    Object.assign(this, args)
  }

  static fromAttestation(input: IAttestation): Attestation {
    return new Attestation(input)
  }

  static fromRequestAndIssuer(
    { rootHash, claim }: IRequestAttestation,
    issuer: web3.PublicKey,
  ): Attestation {
    return new Attestation({
      claimHash: rootHash,
      claimTypeHash: claim.claimTypeHash,
      issuer,
      claimer: claim.owner,
      revoked: false,
    })
  }

  static async fetchAccount(publicKey: web3.PublicKey): Promise<IAttestationAccount> {
    return (await context.program.account.attestation.fetch(
      publicKey,
    )) as unknown as IAttestationAccount
  }

  static async getPDA(attestation: IAttestation) {
    return findAttestationPDA(attestation.issuer, Crypto.hexToU8a(attestation.claimHash))
  }

  static async validate(attestation: IAttestation): Promise<boolean> {
    const [pda] = await Attestation.getPDA(attestation)
    const account = await Attestation.fetchAccount(pda)

    return account.issuer.equals(attestation.issuer) && !account.revoked
  }

  async getPDA() {
    return Attestation.getPDA(this)
  }

  async record(): Promise<RecordResult> {
    const claimHash = Crypto.hexToU8a(this.claimHash)
    const [attestation, bump] = await this.getPDA()
    const [claimType] = await findClaimTypePDA(Crypto.hexToU8a(this.claimTypeHash))

    const signature = await context.program.methods
      .addAttestation(this.claimer, [...claimHash], bump)
      .accounts({
        attestation,
        claimType,
        issuer: this.issuer,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    return {
      signature,
      publicKey: attestation,
    }
  }

  async validate(): Promise<boolean> {
    return Attestation.validate(this)
  }
}

export * from './utils'
