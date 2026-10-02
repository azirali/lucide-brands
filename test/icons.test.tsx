import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as legacy from 'lucide-react-1.0.0';
import * as lucide from 'lucide-react';
import { describe, expect, it } from 'vitest';
import * as brands from '../src';

const ICONS = [
  'Chromium', 'Codepen', 'Codesandbox', 'Dribbble', 'Facebook', 'Figma',
  'Framer', 'Github', 'Gitlab', 'Instagram', 'Linkedin', 'Pocket',
  'Slack', 'Trello', 'Twitch', 'Twitter', 'Youtube',
] as const;

const render = (icon: unknown, props: Record<string, unknown> = {}) =>
  renderToStaticMarkup(createElement(icon as ComponentType<Record<string, unknown>>, props));

describe.each(ICONS)('%s', (name) => {
  const icon = brands[name];

  it('is missing from the installed lucide-react', () => {
    expect((lucide as Record<string, unknown>)[name]).toBeUndefined();
  });

  it('renders the same SVG as lucide-react 1.0.0', () => {
    const before = (legacy as Record<string, unknown>)[name];
    expect(render(icon)).toBe(render(before));
  });

  it('keeps the same props as lucide-react 1.0.0', () => {
    const before = (legacy as Record<string, unknown>)[name];
    const props = { size: 32, color: 'red', strokeWidth: 1.5, absoluteStrokeWidth: true, className: 'x' };
    expect(render(icon, props)).toBe(render(before, props));
  });

  it('exports the lucide-style aliases', () => {
    const all = brands as Record<string, unknown>;
    expect(all[`${name}Icon`]).toBe(icon);
    expect(all[`Lucide${name}`]).toBe(icon);
  });
});

it('keeps the Chrome alias of Chromium', () => {
  expect(brands.Chrome).toBe(brands.Chromium);
  expect(brands.ChromeIcon).toBe(brands.Chromium);
  expect(brands.LucideChrome).toBe(brands.Chromium);
});

it('renders like every other lucide icon', () => {
  const markup = render(brands.Github);
  expect(markup).toContain('class="lucide lucide-github"');
  expect(markup).toContain('stroke="currentColor"');
});

it('is tree-shakeable', async () => {
  const { build } = await import('esbuild');
  const result = await build({
    stdin: { contents: "import { Github } from './src'; console.log(Github);", resolveDir: process.cwd(), loader: 'ts' },
    bundle: true,
    write: false,
    format: 'esm',
    external: ['react', 'lucide-react'],
  });
  const code = result.outputFiles[0].text;
  expect(code).toMatch(/createLucideIcon\(\s*["']github["']/);
  expect(code).not.toMatch(/["']youtube["']/);
});

it('picks up LucideProvider defaults', () => {
  const markup = renderToStaticMarkup(
    createElement(lucide.LucideProvider, { size: 18, color: 'tomato', children: createElement(brands.Github) }),
  );
  expect(markup).toContain('width="18"');
  expect(markup).toContain('stroke="tomato"');
});
