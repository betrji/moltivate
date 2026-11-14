import { execFileSync } from 'node:child_process';

// Inspect Git's index, rather than ignored local toolchains or private wallets.
// A gitlink can break actions/checkout before any CI script can execute.
export function invalidEntries(index) {
  return index.split('\0').filter(Boolean).filter(entry => {
    const separator = entry.indexOf('\t');
    const file = entry.slice(separator + 1);
    return entry.startsWith('160000 ') ||
      /(^|\/)(?:\.isolated|\.git|target|dist|build|\.anchor|test-ledger|wallets|keypairs|secrets)(\/|$)/i.test(file) ||
      /\.(?:patch|bundle)$/i.test(file) ||
      /(^|\/)(?:id\.json|[^/]*-keypair\.json|\.env(?:\..+)?|[^/]+\.(?:key|pem))$/i.test(file) &&
        !/(^|\/)\.env\.example$/.test(file);
  });
}

export function checkRepository(root) {
  const index = execFileSync('git', ['ls-files', '--stage', '-z'], { cwd: root, encoding: 'utf8' });
  const invalid = invalidEntries(index);
  if (invalid.length) {
    throw new Error(`Remove gitlinks, local checkouts, generated output and credential files from the index:\n${invalid.join('\n')}`);
  }
  console.log('Repository index contains no gitlinks or prohibited workspace paths.');
}
