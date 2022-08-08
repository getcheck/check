import { BN, setProvider } from '@project-serum/anchor'
import { airdrop, program, provider, wallet } from './utils'
import Check from '@getcheck/core'
import { createCredential } from './mocks'

describe('deposit', () => {
  beforeAll(async () => {
    setProvider(provider)
    Check.init(provider, wallet)

    await airdrop(wallet.publicKey)
  })

  test('deposit', async () => {
    const [credential, attestationPublicKey] = await createCredential(wallet.publicKey)
    const { program: checkProgram } = Check.context

    const signature = await program.methods
      .deposit(new BN(1000))
      .accounts({
        user: wallet.publicKey,
        attestation: attestationPublicKey,
        checkProgram: checkProgram.programId,
      })
      .signers([wallet.payer])
      .rpc({ commitment: 'confirmed' })

    const tx = await provider.connection.getTransaction(signature, { commitment: 'confirmed' })

    console.log(tx.meta.logMessages)
  })
})
