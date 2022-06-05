import { AnchorProvider, Program, web3, workspace } from '@project-serum/anchor'
import { PrivatePool } from '../target/types/private_pool'
import process from 'process'
import { SeedWallet } from '@getcheck/core'

const url = process.env.ANCHOR_PROVIDER_URL
const options = AnchorProvider.defaultOptions()
const connection = new web3.Connection(url, options.commitment)

export const program = workspace.PrivatePool as Program<PrivatePool>

// DeAbSs8MdyNbVCfGiF9cNEEJYQRXwU7ijwmZZvqXPyAH
export const payer = web3.Keypair.fromSecretKey(
  new Uint8Array([
    225, 60, 117, 68, 123, 252, 1, 200, 41, 251, 54, 121, 6, 167, 204, 18, 140, 168, 206, 74, 254,
    156, 230, 10, 212, 124, 162, 85, 120, 78, 122, 106, 187, 209, 148, 182, 34, 149, 175, 173, 192,
    85, 175, 252, 231, 130, 76, 40, 175, 177, 44, 111, 250, 168, 3, 236, 149, 34, 236, 19, 46, 9,
    66, 138,
  ]),
)

export const wallet = new SeedWallet(payer)
export const provider = new AnchorProvider(connection, wallet, options)

export const airdrop = async (to: web3.PublicKey, amount = web3.LAMPORTS_PER_SOL) => {
  const signature = await provider.connection.requestAirdrop(to, amount)

  return provider.connection.confirmTransaction(signature)
}
