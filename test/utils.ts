import { Program, web3, workspace } from '@coral-xyz/anchor'
import { Check } from '../target/types/check'

const CLAIM_TYPE_PREFIX = 'claim_type'
const ATTESTATION_PREFIX = 'attestation'

export const program = workspace.Check as Program<Check>

export const findClaimTypePDA = (hash: Buffer) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from(CLAIM_TYPE_PREFIX), hash],
    program.programId,
  )
}

export const findAttestationPDA = (issuer: web3.PublicKey, hash: Buffer) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from(ATTESTATION_PREFIX), issuer.toBuffer(), hash],
    program.programId,
  )
}
