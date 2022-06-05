import { Wallet } from '@getcheck/types'
import { Program, AnchorProvider, web3 } from '@project-serum/anchor'
import { config } from './config'
import context from './context'
import { Check, IDL } from './idl'

export const init = (provider: AnchorProvider, wallet: Wallet) => {
  if (!provider.wallet.publicKey.equals(wallet.publicKey)) {
    throw new Error('Wallet mismatch')
  }

  context.program = new Program<Check>(IDL, new web3.PublicKey(config.programs.check), provider)
  context.wallet = wallet
}
