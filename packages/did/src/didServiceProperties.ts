import { DidUrl } from './didUrl'

export type DidServiceProperties = {
  id: DidUrl
  type: string | Array<string>
  serviceEndpoint: string | Map<string, string>
}
