import assert from 'node:assert/strict';
import { test } from 'node:test';
import { invalidEntries } from '../scripts/check-repository.mjs';

const entry = (file, mode = '100644') => `${mode} ${'a'.repeat(40)} 0\t${file}\0`;

test('rejects accidental scratch gitlinks without requiring a submodule checkout', () => {
  assert.equal(invalidEntries(entry('.isolated/commitment-stakes', '160000')).length, 1);
  assert.equal(invalidEntries(entry('programs/other', '160000')).length, 1);
});

test('allows regular tracked files, including recovery evidence', () => {
  for (const file of ['.isolated/recovery-evidence/manifest.json',
    '.isolated/recovery-evidence/demo-ci-fix.bundle',
    '.isolated/recovery-evidence/0001-fix-ci-replace-accidental-gitlink-with-reviewed-Anch.patch',
    'programs/commitment-stakes/Cargo.toml']) {
    assert.deepEqual(invalidEntries(entry(file)), [], file);
  }
});
