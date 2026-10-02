#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { migrateSource } from './migrate.mjs';

const HELP = `Usage: npx lucide-brands migrate [dir] [--dry-run]

Moves the brand icons removed in lucide-react 1.1 (Github, Twitter, Linkedin,
Youtube, ...) from 'lucide-react' imports to 'lucide-brands' imports.

  dir         Folder to scan (default: current folder)
  --dry-run   Show what would change without writing files
`;

const EXTENSIONS = /\.(?:[cm]?[jt]sx?)$/;
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', '.nuxt', '.svelte-kit', '.turbo', '.vercel']);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) yield* walk(join(dir, entry.name));
    } else if (EXTENSIONS.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      yield join(dir, entry.name);
    }
  }
}

const args = process.argv.slice(2);
const [command, ...rest] = args;

if (!command || args.includes('--help') || args.includes('-h')) {
  console.log(HELP);
  process.exit(0);
}
if (command !== 'migrate') {
  console.error(`Unknown command: ${command}\n\n${HELP}`);
  process.exit(1);
}

const dryRun = rest.includes('--dry-run');
const root = resolve(rest.find((a) => !a.startsWith('-')) ?? '.');
if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`Not a folder: ${root}`);
  process.exit(1);
}

let changedFiles = 0;
const movedNames = new Set();
for (const file of walk(root)) {
  const source = readFileSync(file, 'utf8');
  if (!source.includes('lucide-react')) continue;

  const { code, moved, warnings } = migrateSource(source);
  const name = relative(process.cwd(), file);
  for (const warning of warnings) console.warn(`! ${name}: ${warning}`);
  if (code === source) continue;

  changedFiles++;
  moved.forEach((n) => movedNames.add(n));
  console.log(`${dryRun ? '~' : '✓'} ${name}: ${moved.join(', ')}`);
  if (!dryRun) writeFileSync(file, code);
}

if (changedFiles === 0) {
  console.log('No brand icon imports from lucide-react found.');
} else {
  console.log(`\n${dryRun ? 'Would update' : 'Updated'} ${changedFiles} file(s): ${[...movedNames].sort().join(', ')}`);
  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, 'utf8')) : {};
  const installed = { ...pkg.dependencies, ...pkg.devDependencies }['lucide-brands'];
  if (!installed) console.log('Next: npm install lucide-brands');
}
