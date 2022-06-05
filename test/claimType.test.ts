import { AnchorProvider, setProvider, utils, web3 } from '@project-serum/anchor'
import { findClaimTypePDA, program } from './utils'

describe('claim type', () => {
  const provider = AnchorProvider.env()

  beforeAll(() => {
    setProvider(provider)
  })

  test('add claim type', async () => {
    const hash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')
    const [claimType, bump] = await findClaimTypePDA(hash)

    await program.methods
      .addClaimType([...hash], bump)
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
    const hash = Buffer.from(utils.sha256.hash(Math.random().toString()), 'hex')
    const [claimType, bump] = await findClaimTypePDA(hash)

    await program.methods
      .addClaimType([...hash], bump)
      .accounts({
        claimType,
        payer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc()

    try {
      await program.methods
        .addClaimType([...hash], bump)
        .accounts({
          claimType,
          payer: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc()
      fail()
    } catch (err) {
      expect(err.toString()).toEqual(
        'Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x0',
      )
    }
  })

  test('invalid hash', async () => {
    const invalidHash = Buffer.from(utils.sha256.hash(Math.random().toString()).slice(1), 'hex')
    const [claimType, bump] = await findClaimTypePDA(invalidHash)

    try {
      await program.methods
        .addClaimType([...invalidHash], bump)
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
