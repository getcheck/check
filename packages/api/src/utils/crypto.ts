import { sortObj } from 'jsonabc'
import { utils } from '@project-serum/anchor'

export const hashStr = (value: string) => {
  return utils.sha256.hash(value)
}

export const hashObj = (value: Record<string, unknown>) => {
  const str = JSON.stringify(sortObj(value))
  return hashStr(str)
}
