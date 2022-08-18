import { Did } from '../src/did'
import { parseDid, verfiyDid } from '../src/utils'

describe('did', () => {
  test('parseDid', () => {
    const inputs = [
      {
        payload: 'did:check:21tDAKCERh95uGgKbJNHYp',
        expected: {
          protocol: 'did',
          method: 'check',
          methodSpecificId: '21tDAKCERh95uGgKbJNHYp',
        },
      },
      {
        payload: '  did:check:21tDAKCERh95uGgKbJNHYp     ',
        expected: {
          protocol: 'did',
          method: 'check',
          methodSpecificId: '21tDAKCERh95uGgKbJNHYp',
        },
      },
      {
        payload:
          'did:check:eeeee13371337?service=files&relativeRef=%2Fmyresume%2Fdoc%3Fversion%3Dlatest',
        expected: {
          protocol: 'did',
          method: 'check',
          methodSpecificId: 'eeeee13371337',
          query: '?service=files&relativeRef=%2Fmyresume%2Fdoc%3Fversion%3Dlatest',
        },
      },
      {
        payload:
          'did:check:eeeee13371337?service=files&relativeRef=%2Fmyresume%2Fdoc%3Fversion%3Dlatest ',
        expected: {
          protocol: 'did',
          method: 'check',
          methodSpecificId: 'eeeee13371337',
          query: '?service=files&relativeRef=%2Fmyresume%2Fdoc%3Fversion%3Dlatest',
        },
      },
      {
        payload: 'did:check:ddFFxx0x0x0x/custom/path?customquery',
        expected: {
          protocol: 'did',
          method: 'check',
          methodSpecificId: 'ddFFxx0x0x0x',
          query: '/custom/path?customquery',
        },
      },
      {
        payload: 'did:check:1234#keys-1',
        expected: {
          protocol: 'did',
          method: 'check',
          methodSpecificId: '1234',
          query: '#keys-1',
        },
      },
    ]

    for (const input of inputs) {
      const result = parseDid(input.payload as Did)
      expect(result).toEqual(input.expected)
    }
  })

  test('verifyDid', () => {
    const inputs = [
      {
        payload: 'did::21tDAKCERh95uGgKbJNHYp',
        expected: false,
      },
      {
        payload: '::21tDAKCERh95uGgKbJNHYp',
        expected: false,
      },
      {
        payload: '21tDAKCERh95uGgKbJNHYp',
        expected: false,
      },
      {
        payload: 'did:check:21tDAKCERh95uGgKbJNHYp',
        expected: true,
      },
      {
        payload: 'did:check:_',
        expected: false,
      },
      {
        payload: 'did:check:',
        expected: false,
      },
      {
        payload: 'did:check:21tDAKCERh95uGgKbJNHYp?service=agent',
        expected: true,
      },
      {
        payload: 'did:check:21tDAKCERh95uGgKbJNHYp#key-1',
        expected: true,
      },
      {
        payload: 'did:check:21tDAKCERh95uGgKbJNHYp/some/path',
        expected: true,
      },
      {
        payload: 'did:check:21tDAKCERh95uGgKbJNHYp/some/path?someRef#key-1',
        expected: true,
      },
    ]

    for (const input of inputs) {
      const result = verfiyDid(input.payload as Did)
      expect(result).toEqual(input.expected)
    }
  })
})
