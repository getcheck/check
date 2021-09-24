import { Idl, Program, Provider, setProvider, web3 } from '@project-serum/anchor'
import idlJson from './check.json'
import { config } from './config'

let _program: Program = null

export const setProgram = (program: Program) => {
  _program = program
}

export const init = (provider: Provider) => {
  const idl = idlJson as Idl

  setProvider(provider)
  setProgram(new Program(idl, new web3.PublicKey(config.programs.check), provider))
}

export const program = _program
