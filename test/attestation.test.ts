import { AnchorProvider, web3, setProvider, LangErrorCode } from '@coral-xyz/anchor'
import { sha256 } from '@noble/hashes/sha256'
import { findAttestationPDA, findClaimTypePDA, program } from './utils'

describe('attestation', () => {
  const provider = AnchorProvider.env()
  const claimTypeHash = Buffer.from(sha256(Math.random().toString()))

  beforeAll(async () => {
    setProvider(provider)

    const [claimType] = findClaimTypePDA(claimTypeHash)
    await program.methods
      .addClaimType([...claimTypeHash])
      .accounts({
        claimType,
        payer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()
  })

  test('add attestation', async () => {
    const issuer = provider.wallet.publicKey
    const claimer = web3.Keypair.generate().publicKey
    const claimHash = Buffer.from(sha256(Math.random().toString()))
    const [attestation] = findAttestationPDA(issuer, claimHash)
    const [claimType] = findClaimTypePDA(claimTypeHash)

    await program.methods
      .addAttestation([...claimHash])
      .accounts({
        attestation,
        claimType,
        claimer,
        issuer,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    const account = await program.account.attestation.fetch(attestation)

    expect(Buffer.from(account.claimHash)).toEqual(claimHash)
    expect(account.claimer.equals(claimer))
    expect(account.revoked).toEqual(false)
  })

  test('invalid claim type', async () => {
    const issuer = provider.wallet.publicKey
    const claimer = web3.Keypair.generate().publicKey
    const claimHash = Buffer.from(sha256(Math.random().toString()))
    const [attestation] = findAttestationPDA(issuer, claimHash)
    const [claimType] = findClaimTypePDA(Buffer.from(sha256(Math.random().toString())))

    try {
      await program.methods
        .addAttestation([...claimHash])
        .accounts({
          attestation,
          claimType,
          claimer,
          issuer,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc()
      fail()
    } catch ({ error }) {
      expect(error.errorCode.number).toEqual(LangErrorCode.AccountNotInitialized)
    }
  })
})
