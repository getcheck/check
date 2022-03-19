import { web3 } from '@project-serum/anchor'
import context from '../context'

const ATTESTATION_PREFIX = 'attestation'

export const findAttestationPDA = async (
  issuer: web3.PublicKey,
  claimHash: Buffer | Uint8Array,
) => {
  return web3.PublicKey.findProgramAddress(
    [Buffer.from(ATTESTATION_PREFIX), issuer.toBuffer(), claimHash],
    context.program.programId,
  )
}
