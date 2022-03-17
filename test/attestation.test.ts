import { Provider, web3, setProvider, utils } from '@project-serum/anchor'
import { findAttestationPDA, findClaimTypePDA, program } from './utils'

describe('attestation', () => {
  const provider = Provider.env()
  const claimTypeHash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')

  beforeAll(async () => {
    setProvider(provider)

    const [claimType, bump] = await findClaimTypePDA(claimTypeHash)

    await program.rpc.addClaimType(claimTypeHash, bump, {
      accounts: {
        claimType,
        payer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
    })
  })

  test('add attestation', async () => {
    const issuer = provider.wallet.publicKey
    const claimHash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')
    const [attestation, bump] = await findAttestationPDA(issuer, claimHash)
    const [claimType] = await findClaimTypePDA(claimTypeHash)

    await program.rpc.addAttestation(claimHash, bump, {
      accounts: {
        attestation,
        claimType,
        issuer,
        systemProgram: web3.SystemProgram.programId,
      },
    })

    const account = await program.account.attestation.fetch(attestation)

    expect(Buffer.from(account.claimHash)).toEqual(claimHash)
    expect(account.revoked).toEqual(false)
  })

  test('invalid claim type', async () => {
    const issuer = provider.wallet.publicKey
    const claimHash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')
    const [attestation, bump] = await findAttestationPDA(issuer, claimHash)
    const [claimType] = await findClaimTypePDA(
      Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex'),
    )

    try {
      await program.rpc.addAttestation(claimHash, bump, {
        accounts: {
          attestation,
          claimType,
          issuer,
          systemProgram: web3.SystemProgram.programId,
        },
      })
      fail()
    } catch (err) {
      expect(err.code).toEqual(3012)
    }
  })
})
