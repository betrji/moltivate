import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkRepository } from './check-repository.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
checkRepository(root);
async function sources(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? sources(target) : /\.[cm]?js$/.test(entry.name) ? [target] : [];
  }));
  return files.flat();
}
const files = [path.join(root, 'playwright.config.js'), ...await sources(path.join(root, 'apps/web')),
  ...await sources(path.join(root, 'scripts')), ...await sources(path.join(root, 'tests'))];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log(`Syntax checked ${files.length} JavaScript files.`);
