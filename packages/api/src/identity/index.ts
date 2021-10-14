import { IIdentity, Wallet } from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import { Crypto } from '../utils'

export class Identity implements IIdentity {
  readonly pubkey: IIdentity['pubkey']
  readonly boxPubkey: IIdentity['boxPubkey']

  constructor(args: IIdentity) {
    Object.assign(this, args)
  }

  static fromWallet({ publicKey, boxPublicKey }: Wallet) {
    return new Identity({ pubkey: publicKey, boxPubkey: boxPublicKey })
  }

  static fromKeypair(keypair: web3.Keypair) {
    const { publicKey } = Crypto.createBoxKeyPair(keypair.secretKey)
    return new Identity({ pubkey: keypair.publicKey, boxPubkey: publicKey })
  }
}
