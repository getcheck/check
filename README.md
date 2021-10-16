# Check Protocol
Verifiable credentials in the Web 3.0

## Inspiration
We are really concerned about personal data and the problem of access to it by third party companies.
We were inspired to create a trusted internet, or more precisely, a protocol that would allow all participants to claim about themselves and receive some kind of services, but still stay anonymous.
Unfortunately, there aren't many solutions available. Either they are highly centralized or not fast and convenient enough.

## What it does
First of all, it is a protocol that going to provide Solana with an interoperable trust layer solution for decentralized identities and verifiable credentials that can be implemented in numerous use-cases:
- for all projects in Solana ecosystem (DAO, DeFi, blockchain games, etc);
- for services which are not in the crypto space (government, healthcare, financial services, etc).
**Check** allows participants to issue self-sovereign, anonymous, verifiable credentials.
It is compatible with _W3 Verifiable Credentials Data Model_ (https://www.w3.org/TR/vc-data-model/) and based on e2e encryption.

## How we built it
Based on the _Verifiable Credentials Data Model_, we developed a protocol that includes smart contracts (we also used Anchor) as a registry to maintain trust and an SDK that can be used from any environment.
We also did a huge amount of work on the anonymity of participants and the security of their personal data. This can be seen in our tutorial.
_Solana_ and crypto capabilities fully cover all our tasks, as well as the planned features.

## Challenges we ran into
One of the main challenges was to get the protocol right so that the data would remain private but easy to verify for accuracy. And make it easy and fast to work in the _Solana_ ecosystem

## Accomplishments that we're proud of
First of all, we are very proud that we were able to complete the basic features that we wanted to do. The attestation request alone required a lot of work. We had no trouble making asymmetric encryption based on _Solana_ Keypair. And we are very happy about it.
Well, the fact that we succeeded in switching to Anchor is also pleasing.

## What we learned
The first thing we learned was a lot about the _Verifiable Credentials Data Model_.
And the further we dived into it and into _Solana_. the more we understood the importance of our protocol. And we were also glad that _Solana_ was perfect for us.
We've also been pumping up our cryptography skills quite a bit :)

## What's next for Check
We want to finalize our SDK and services.
We also want to make a fully decentralized message bus for communication between participants.
Make user-friendly clients for participants. Both web and mobile versions.
Integration with different issuer providers, KYC, etc.
