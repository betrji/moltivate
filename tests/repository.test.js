import assert from 'node:assert/strict';
import { test } from 'node:test';
import { invalidEntries } from '../scripts/check-repository.mjs';

const entry = (file, mode = '100644') => `${mode} ${'a'.repeat(40)} 0\t${file}\0`;

test('rejects the broken gitlink and nested checkout layout', () => {
  assert.equal(invalidEntries(entry('.isolated/commitment-stakes', '160000')).length, 1);
  assert.equal(invalidEntries(entry('programs/other', '160000')).length, 1);
  assert.equal(invalidEntries(entry('.isolated/commitment-stakes/Cargo.toml')).length, 1);
});

test('rejects generated Anchor files and credential paths at any depth', () => {
  for (const file of ['target/deploy/program.so', 'programs/stakes/target/idl/stakes.json',
    'programs/stakes/.anchor/state', 'test-ledger/ledger', 'wallets/dev.json',
    'keypairs/dev.json', 'secrets/token', 'programs/stakes/dev-keypair.json',
    'id.json', '.env', '.env.local', 'private.key', 'private.pem', 'nested/.git/config',
    'recovery.patch', 'recovery.bundle', 'dist/index.html', 'programs/stakes/build/output']) {
    assert.equal(invalidEntries(entry(file)).length, 1, file);
  }
});

test('allows reviewed source, manifests, lockfiles, docs and redacted examples', () => {
  for (const file of ['programs/commitment-stakes/programs/commitment-stakes/src/lib.rs',
    'programs/commitment-stakes/Cargo.toml', 'programs/commitment-stakes/Cargo.lock',
    'programs/commitment-stakes/docs/account-contract.md', '.env.example',
    'nested/.env.example', 'apps/web/assets/fonts/dm-sans.woff2']) {
    assert.deepEqual(invalidEntries(entry(file)), [], file);
  }
});
