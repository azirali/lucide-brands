import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as brands from '../src';
// @ts-expect-error plain JS module without types
import { BRAND_NAMES, migrateSource } from '../cli/migrate.mjs';

const migrate = (code: string): string => migrateSource(code).code;

describe('migrateSource', () => {
  it('moves brand icons and keeps the rest in lucide-react', () => {
    expect(migrate(`import { Github, Mail, Linkedin } from 'lucide-react';`)).toBe(
      `import { Mail } from 'lucide-react';\nimport { Github, Linkedin } from 'lucide-brands';`,
    );
  });

  it('replaces the import when only brand icons are imported', () => {
    expect(migrate(`import { Github } from "lucide-react"`)).toBe(`import { Github } from "lucide-brands"`);
  });

  it('keeps aliases, Icon/Lucide variants and type specifiers', () => {
    expect(
      migrate(`import { GithubIcon, LucideTwitter, Youtube as YT, type LucideProps } from 'lucide-react';`),
    ).toBe(
      `import { type LucideProps } from 'lucide-react';\nimport { GithubIcon, LucideTwitter, Youtube as YT } from 'lucide-brands';`,
    );
  });

  it('handles multi-line imports and indentation', () => {
    const before = [
      'import {',
      '  ArrowUp,',
      '  Github,',
      '  Send,',
      "} from 'lucide-react';",
      'const x = 1;',
    ].join('\n');
    const after = [
      'import {',
      '  ArrowUp,',
      '  Send,',
      "} from 'lucide-react';",
      "import { Github } from 'lucide-brands';",
      'const x = 1;',
    ].join('\n');
    expect(migrate(before)).toBe(after);
  });

  it('leaves files without brand icons untouched', () => {
    const code = `import { Mail, GitBranch, GitPullRequest } from 'lucide-react';\nimport { Github } from './icons';`;
    expect(migrate(code)).toBe(code);
  });

  it('does not touch other packages', () => {
    const code = `import { Github } from 'lucide-react-native';\nimport { Github as G } from '@lucide/angular';`;
    expect(migrate(code)).toBe(code);
  });

  it('moves Vue icons to lucide-brands/vue', () => {
    expect(migrate(`import { Github, Mail } from '@lucide/vue';`)).toBe(
      `import { Mail } from '@lucide/vue';\nimport { Github } from 'lucide-brands/vue';`,
    );
    expect(migrate(`import { LinkedinIcon } from "lucide-vue-next"`)).toBe(`import { LinkedinIcon } from "lucide-brands/vue"`);
  });

  it('handles export ... from re-exports', () => {
    expect(migrate(`export { Github, Mail as MailIcon } from 'lucide-react';`)).toBe(
      `export { Mail as MailIcon } from 'lucide-react';\nexport { Github } from 'lucide-brands';`,
    );
    expect(migrate(`export type { LucideProps } from 'lucide-react';`)).toBe(`export type { LucideProps } from 'lucide-react';`);
  });

  it('handles require() destructuring, with renames', () => {
    expect(migrate(`const { Github: GithubLogo, Mail } = require('lucide-react');`)).toBe(
      `const { Mail } = require('lucide-react');\nconst { Github: GithubLogo } = require('lucide-brands');`,
    );
    expect(migrate(`  let {Twitter} = require("lucide-react")`)).toBe(`  let { Twitter } = require("lucide-brands")`);
  });

  it('warns about namespace imports instead of guessing', () => {
    const result = migrateSource(`import * as Icons from 'lucide-react';\nconst a = <Icons.Github />;`);
    expect(result.code).toContain(`from 'lucide-react'`);
    expect(result.warnings).toEqual(['Icons.Github (namespace import, change it by hand)']);
  });

  it('knows every component exported by the package', () => {
    const exported = Object.keys(brands).filter((name) => !name.endsWith('IconNode'));
    expect([...BRAND_NAMES].sort()).toEqual(exported.sort());
  });
});

describe('npx lucide-brands migrate', () => {
  const cli = fileURLToPath(new URL('../cli/index.mjs', import.meta.url));

  function project() {
    const dir = mkdtempSync(join(tmpdir(), 'lucide-brands-'));
    mkdirSync(join(dir, 'src'));
    mkdirSync(join(dir, 'node_modules/pkg'), { recursive: true });
    writeFileSync(join(dir, 'src/Footer.tsx'), `import { Github, Mail } from 'lucide-react';\n`);
    writeFileSync(join(dir, 'src/plain.ts'), `export const a = 1;\n`);
    writeFileSync(
      join(dir, 'src/Footer.vue'),
      `<script setup>\nimport { Github, Mail } from '@lucide/vue';\n</script>\n\n<template><Github /><Mail /></template>\n`,
    );
    writeFileSync(join(dir, 'node_modules/pkg/index.js'), `import { Github } from 'lucide-react';\n`);
    return dir;
  }

  it('rewrites source files and skips node_modules', () => {
    const dir = project();
    const out = execFileSync('node', [cli, 'migrate'], { cwd: dir, encoding: 'utf8' });
    expect(out).toContain('src/Footer.tsx: Github');
    expect(out).toContain('Next: npm install lucide-brands');
    expect(readFileSync(join(dir, 'src/Footer.tsx'), 'utf8')).toBe(
      `import { Mail } from 'lucide-react';\nimport { Github } from 'lucide-brands';\n`,
    );
    expect(readFileSync(join(dir, 'node_modules/pkg/index.js'), 'utf8')).toContain(`from 'lucide-react'`);
    expect(readFileSync(join(dir, 'src/Footer.vue'), 'utf8')).toBe(
      `<script setup>\nimport { Mail } from '@lucide/vue';\nimport { Github } from 'lucide-brands/vue';\n</script>\n\n<template><Github /><Mail /></template>\n`,
    );
  });

  it('changes nothing with --dry-run', () => {
    const dir = project();
    const out = execFileSync('node', [cli, 'migrate', '--dry-run'], { cwd: dir, encoding: 'utf8' });
    expect(out).toContain('Would update 2 file(s)');
    expect(readFileSync(join(dir, 'src/Footer.tsx'), 'utf8')).toBe(`import { Github, Mail } from 'lucide-react';\n`);
  });
});
