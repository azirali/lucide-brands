import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import * as legacy from 'lucide-vue-1.0.0';
import * as current from '@lucide/vue';
import { describe, expect, it } from 'vitest';
import * as vue from '../src/vue';

const ICONS = [
  'Chromium', 'Codepen', 'Codesandbox', 'Dribbble', 'Facebook', 'Figma',
  'Framer', 'Github', 'Gitlab', 'Instagram', 'Linkedin', 'Pocket',
  'Slack', 'Trello', 'Twitch', 'Twitter', 'Youtube',
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const render = (icon: any, props: Record<string, unknown> = {}) => renderToString(h(icon, props));
// lucide-vue-next 1.0.0 also added a `lucide-<name>-icon` class; only the artwork is compared.
const paths = (html: string) => html.replace(/^<svg[^>]*>/, '');

describe.each(ICONS)('%s', (name) => {
  const icon = vue[name];

  it('is missing from the installed @lucide/vue', () => {
    expect((current as Record<string, unknown>)[name]).toBeUndefined();
  });

  it('renders the same shapes as lucide-vue-next 1.0.0', async () => {
    const before = (legacy as Record<string, unknown>)[name];
    expect(paths(await render(icon))).toBe(paths(await render(before)));
  });

  it('applies props like any @lucide/vue icon', async () => {
    const html = await render(icon, { size: 32, color: 'red', strokeWidth: 1.5, class: 'x' });
    expect(html).toContain('width="32"');
    expect(html).toContain('stroke="red"');
    expect(html).toContain('stroke-width="1.5"');
    expect(html).toMatch(/class="[^"]*\bx\b/);
  });

  it('exports the lucide-style aliases', () => {
    const all = vue as Record<string, unknown>;
    expect(all[`${name}Icon`]).toBe(icon);
    expect(all[`Lucide${name}`]).toBe(icon);
  });
});

it('keeps the Chrome alias', () => {
  expect(vue.Chrome).toBe(vue.Chromium);
});

it('renders like a regular @lucide/vue icon', async () => {
  const brand = await render(vue.Github);
  const regular = await render(current.Mail);
  const svgTag = (html: string) => html.match(/^<svg[^>]*>/)![0].replace(/lucide-(github|mail)/, 'lucide-NAME');
  expect(svgTag(brand)).toBe(svgTag(regular));
});

it('is tree-shakeable', async () => {
  const { build } = await import('esbuild');
  const result = await build({
    stdin: { contents: "import { Github } from './src/vue'; console.log(Github);", resolveDir: process.cwd(), loader: 'ts' },
    bundle: true,
    write: false,
    format: 'esm',
    external: ['vue', '@lucide/vue'],
  });
  const code = result.outputFiles[0].text;
  expect(code).toMatch(/createLucideIcon\(\s*["']github["']/);
  expect(code).not.toMatch(/["']youtube["']/);
});
