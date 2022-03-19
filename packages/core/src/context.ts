import { Wallet } from '@getcheck/types'
import { Program } from '@project-serum/anchor'

export class Context {
  constructor(public program: Program = null, public wallet: Wallet = null) {}
}

export default new Context()
