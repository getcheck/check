import { IIdentity, Wallet } from '@getcheck/types'
import { web3 } from '@project-serum/anchor'
import { Crypto } from '../utils'

export class Identity implements IIdentity {
  readonly publicKey: IIdentity['publicKey']
  readonly boxPublicKey: IIdentity['boxPublicKey']

  constructor(args: IIdentity) {
    Object.assign(this, args)
  }

  static fromWallet({ publicKey, boxPublicKey }: Wallet) {
    return new Identity({ publicKey: publicKey, boxPublicKey: boxPublicKey })
  }

  static fromKeypair(keypair: web3.Keypair) {
    const { publicKey } = Crypto.createBoxKeyPair(keypair.secretKey)
    return new Identity({ publicKey: keypair.publicKey, boxPublicKey: publicKey })
  }
}
