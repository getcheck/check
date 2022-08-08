import { AnchorProvider, web3, setProvider, utils, LangErrorCode } from '@project-serum/anchor'
import { findAttestationPDA, findClaimTypePDA, program } from './utils'

describe('attestation', () => {
  const provider = AnchorProvider.env()
  const claimTypeHash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')

  beforeAll(async () => {
    setProvider(provider)

    const [claimType, bump] = await findClaimTypePDA(claimTypeHash)

    await program.methods
      .addClaimType([...claimTypeHash], bump)
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
    const claimHash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')
    const [attestation, bump] = await findAttestationPDA(issuer, claimHash)
    const [claimType] = await findClaimTypePDA(claimTypeHash)

    await program.methods
      .addAttestation([...claimHash], bump)
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
    const claimHash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')
    const [attestation, bump] = await findAttestationPDA(issuer, claimHash)
    const [claimType] = await findClaimTypePDA(
      Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex'),
    )

    try {
      await program.methods
        .addAttestation([...claimHash], bump)
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
