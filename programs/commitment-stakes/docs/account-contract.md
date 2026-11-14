# Draft account contract: schema version 0

Not an app integration release. These are source account definitions only;
generated IDL/types and transaction verification remain blocked by the toolchain.
Do not send funds to these draft accounts. No join or settlement instruction
exists yet. Rule version 0 cannot enroll users through this source program.

All accounts are Anchor-owned with the default 8-byte account discriminator.
Public keys are 32 bytes; integers use Borsh little endian. Client JSON must carry
u64 values as decimal strings or an appropriate big-integer type.

| Account | PDA seeds (in order) | Data fields (in serialization order) | Total bytes |
| --- | --- | --- | --- |
| Challenge | `challenge`, creator key, id u64 LE | creator pubkey, oracle pubkey, group pubkey (Pot address), id u64, alpha_bps u16, rake_bps u16, target u32, rules_version u16, settled bool, bump u8 | 124 |
| Vault | `vault`, challenge key | challenge pubkey, bump u8 | 41 |
| Treasury | `treasury`, challenge key | challenge pubkey, bump u8 | 41 |
| Pot | `pot`, creator key, group_id u64 LE | creator pubkey, id u64, bump u8 | 49 |

`initialize_group(group_id: u64)` requires creator (writable signer), pot
(writable, initialized PDA) and System Program. Groups are currently scoped by
creator, not by an authenticated off-chain social group.

`initialize(args)` requires creator (writable signer), challenge, vault and
treasury (writable initialized PDAs), pot (read-only verified PDA belonging to
creator), and System Program. Argument order: id u64, oracle pubkey, alpha_bps
u16, rake_bps u16, target u32. It rejects zero target, zero oracle, or basis points
above 10000, and initializes rules_version=0 and settled=false. There are no
configuration mutators. Creating an existing PDA should fail through Anchor init.
All behaviors here are source intent, not verified execution.

Future settlement must verify the frozen oracle signer, all PDA/account
relationships, exact funded roster, eligibility window and terminal state; compute
entitlements entirely on-chain; debit only spendable balances above rent; and
atomically mark settlement once. Pot spending must not let one oracle redirect
another group's balance. Refund and payout must be mutually exclusive.

Publish the compiler-generated `target/idl/commitment_stakes.json` and compatible
types with a program build revision in the completed PR. Keep this document
synchronized with that artifact. PDA/account layout may change before version 1.
