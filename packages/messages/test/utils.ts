import { SeedWallet } from '@getcheck/core'
import { AnchorProvider, web3 } from '@coral-xyz/anchor'

// DeAbSs8MdyNbVCfGiF9cNEEJYQRXwU7ijwmZZvqXPyAH
export const payer = web3.Keypair.fromSecretKey(
  new Uint8Array([
    225, 60, 117, 68, 123, 252, 1, 200, 41, 251, 54, 121, 6, 167, 204, 18, 140, 168, 206, 74, 254,
    156, 230, 10, 212, 124, 162, 85, 120, 78, 122, 106, 187, 209, 148, 182, 34, 149, 175, 173, 192,
    85, 175, 252, 231, 130, 76, 40, 175, 177, 44, 111, 250, 168, 3, 236, 149, 34, 236, 19, 46, 9,
    66, 138,
  ]),
)

const options = AnchorProvider.defaultOptions()
export const connection = new web3.Connection('http://localhost:8899', options.preflightCommitment)
export const wallet = new SeedWallet(payer)
export const provider = new AnchorProvider(connection, wallet, options)
