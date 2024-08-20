import { web3 } from '@coral-xyz/anchor'
import context from '../context'

const ATTESTATION_PREFIX = 'attestation'

export const findAttestationPDA = (issuer: web3.PublicKey, claimHash: Buffer | Uint8Array) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from(ATTESTATION_PREFIX), issuer.toBuffer(), claimHash],
    context.program.programId,
  )
}
