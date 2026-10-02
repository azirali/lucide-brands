// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'lucide';
import { describe, expect, it } from 'vitest';
import * as brands from '../src';
import * as nodes from '../src/nodes';

const NAMES = Object.keys(brands).filter((n) => n.endsWith('IconNode')).map((n) => n.replace(/IconNode$/, ''));
const pascal = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);
const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const shape = (svg: Element) =>
  [...svg.children].map((el) => [el.tagName, Object.fromEntries([...el.attributes].map((a) => [a.name, a.value]))]);
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

describe.each(NAMES)('%s', (name) => {
  const node = (nodes as Record<string, unknown>)[pascal(name)] as nodes.IconNode;

  it('matches the lucide-react 1.0.0 icon node without React keys', () => {
    const reactNode = (brands as Record<string, unknown>)[`${name}IconNode`] as [string, Record<string, string>][];
    expect(node).toEqual(reactNode.map(([tag, { key, ...attrs }]) => [tag, attrs]));
  });

  it('renders with vanilla lucide like the lucide-static 1.0.0 SVG', () => {
    const expected = new DOMParser().parseFromString(
      read(`node_modules/lucide-static-1.0.0/icons/${kebab(name)}.svg`),
      'image/svg+xml',
    ).documentElement;
    expect(shape(createElement(node))).toEqual(shape(expected));
  });
});

it('keeps the Chrome alias', () => {
  expect(nodes.Chrome).toBe(nodes.Chromium);
});

it('does not depend on any framework', () => {
  const source = read('src/nodes.ts');
  expect(source).not.toMatch(/^import /m);
});
