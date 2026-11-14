import { execFileSync } from 'node:child_process';

// Inspect Git's index directly: a gitlink can fail actions/checkout before any CI script runs.
export function invalidEntries(index) {
  return index.split('\0').filter(Boolean).filter(entry => entry.startsWith('160000 '));
}

export function checkRepository(root) {
  const index = execFileSync('git', ['ls-files', '--stage', '-z'], { cwd: root, encoding: 'utf8' });
  const invalid = invalidEntries(index);
  if (invalid.length) {
    throw new Error(`Remove accidental gitlinks from the index:\n${invalid.join('\n')}`);
  }
  console.log('Repository index contains no gitlinks.');
}
