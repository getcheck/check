import { AnchorProvider, setProvider, web3 } from '@coral-xyz/anchor'
import { sha256 } from '@noble/hashes/sha256'
import { findClaimTypePDA, program } from './utils'

describe('claim type', () => {
  const provider = AnchorProvider.env()

  beforeAll(() => {
    setProvider(provider)
  })

  test('add claim type', async () => {
    const hash = Buffer.from(sha256(Math.random().toString()))
    const [claimType] = findClaimTypePDA(hash)

    await program.methods
      .addClaimType([...hash])
      .accounts({
        claimType,
        payer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    const account = await program.account.claimType.fetch(claimType)

    expect(Buffer.from(account.hash)).toEqual(hash)
  })

  test('add claim type twice', async () => {
    const hash = Buffer.from(sha256(Math.random().toString()))
    const [claimType] = findClaimTypePDA(hash)

    await program.methods
      .addClaimType([...hash])
      .accounts({
        claimType,
        payer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    try {
      await program.methods
        .addClaimType([...hash])
        .accounts({
          payer: provider.wallet.publicKey,
        })
        .rpc()
      fail()
    } catch (err) {
      expect(err)
    }
  })

  test('invalid hash', async () => {
    const invalidHash = Buffer.from(sha256(Math.random().toString()).slice(1))
    const [claimType] = findClaimTypePDA(invalidHash)

    try {
      await program.methods
        .addClaimType([...invalidHash])
        .accounts({
          claimType,
          payer: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc()
      fail()
    } catch (err) {
      expect(err)
    }
  })
})
