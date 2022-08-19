import { DidUrl } from '@getcheck/types'

export function verfiyDidUrl(did: DidUrl): boolean {
  const didRegex = /^(did):(check):([a-z]|[0-9]|[A-Z])+((\?|#|\/).*)?$/g
  return didRegex.test(did)
}

export function parseDidUrl(did: DidUrl):
  | {
      protocol: string
      method: string
      methodSpecificId: string
      query?: string
    }
  | undefined {
  const didClean = did.trim() as DidUrl
  if (!verfiyDidUrl(didClean)) {
    return undefined
  }

  const [protocol, method, rawQuery] = didClean.split(':')

  let queryStartIndex = rawQuery.length
  for (let i = 0; i < rawQuery.length; i++) {
    const sym = rawQuery[i]
    if (sym === '#' || sym === '/' || sym === '?') {
      queryStartIndex = i
      break
    }
  }

  const methodSpecificId = rawQuery.slice(0, queryStartIndex)
  const query = queryStartIndex == rawQuery.length ? undefined : rawQuery.slice(queryStartIndex)

  return {
    protocol,
    method,
    methodSpecificId,
    query,
  }
}
