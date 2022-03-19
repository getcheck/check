import { Wallet } from '@getcheck/types'
import { Idl, Program, Provider, web3 } from '@project-serum/anchor'
import idlJson from './check.json'
import { config } from './config'
import context from './context'

export const init = (provider: Provider, wallet: Wallet) => {
  const idl = idlJson as Idl

  if (!provider.wallet.publicKey.equals(wallet.publicKey)) {
    throw new Error('Wallet mismatch')
  }

  context.program = new Program(idl, new web3.PublicKey(config.programs.check), provider)
  context.wallet = wallet
}
