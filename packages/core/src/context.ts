import { Wallet } from '@getcheck/types'
import { Program } from '@coral-xyz/anchor'
import { Check } from './idl'

export class Context {
  constructor(public program: Program<Check> = null, public wallet: Wallet = null) {}
}

export default new Context()
