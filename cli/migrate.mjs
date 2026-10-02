import { readFileSync } from 'node:fs';

export const BRAND_NAMES = new Set(
  JSON.parse(readFileSync(new URL('./names.json', import.meta.url), 'utf8')),
);

// lucide package that lost the brand icons -> lucide-brands entry with the same components
export const TARGETS = {
  'lucide-react': 'lucide-brands',
  '@lucide/vue': 'lucide-brands/vue',
  'lucide-vue-next': 'lucide-brands/vue',
};

const SOURCE = Object.keys(TARGETS)
  .map((s) => s.replace(/[/.]/g, '\\$&'))
  .join('|');
const ID = '[A-Za-z_$][\\w$]*';

// import { A, type B, C as D } from 'lucide-react';   export { A } from 'lucide-react';
const NAMED = new RegExp(
  `^([ \\t]*)(import|export)(\\s+type)?\\s*\\{([^}]*)\\}\\s*from\\s*(['"])(${SOURCE})\\5(\\s*;)?`,
  'gm',
);
// const { A, B: C } = require('lucide-react');
const REQUIRE = new RegExp(
  `^([ \\t]*)(const|let|var)\\s*\\{([^}]*)\\}\\s*=\\s*require\\(\\s*(['"])(${SOURCE})\\4\\s*\\)(\\s*;)?`,
  'gm',
);
// import * as Icons from 'lucide-react';
const NAMESPACE = new RegExp(`import\\s+\\*\\s+as\\s+(${ID})\\s+from\\s+['"](?:${SOURCE})['"]`, 'g');

function parseSpecifiers(body, aliasPattern) {
  const specifier = new RegExp(`^(type\\s+)?(${ID})(?:${aliasPattern}(${ID}))?$`);
  return body
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((text) => {
      const match = specifier.exec(text);
      return { text, imported: match ? match[2] : null };
    });
}

/** Splits `specifiers` into brand icons and the rest, and renders both statements. */
function split({ indent, specifiers, multiline, render }) {
  const brands = specifiers.filter((s) => s.imported && BRAND_NAMES.has(s.imported));
  if (brands.length === 0) return null;

  const rest = specifiers.filter((s) => !brands.includes(s));
  const list = (items, multi) =>
    multi ? `{\n${items.map((s) => `${indent}  ${s.text},`).join('\n')}\n${indent}}` : `{ ${items.map((s) => s.text).join(', ')} }`;
  const brandStatement = render(list(brands, false), true);
  const code = rest.length === 0 ? brandStatement : `${render(list(rest, multiline), false)}\n${brandStatement}`;
  return { code, moved: brands.map((s) => s.imported) };
}

/**
 * Moves brand icon imports/re-exports/requires from lucide-react (and @lucide/vue,
 * lucide-vue-next) to the matching lucide-brands entry. Returns the new source, the
 * names that were moved, and warnings for usages it can't rewrite safely.
 */
export function migrateSource(code) {
  const moved = [];
  const warnings = [];

  let output = code.replace(NAMED, (statement, indent, keyword, typeOnly = '', body, quote, source, semi = '') => {
    const result = split({
      indent,
      specifiers: parseSpecifiers(body, '\\s+as\\s+'),
      multiline: body.includes('\n'),
      render: (list, isBrand) =>
        `${indent}${keyword}${typeOnly} ${list} from ${quote}${isBrand ? TARGETS[source] : source}${quote}${semi}`,
    });
    if (!result) return statement;
    moved.push(...result.moved);
    return result.code;
  });

  output = output.replace(REQUIRE, (statement, indent, kind, body, quote, source, semi = '') => {
    const result = split({
      indent,
      specifiers: parseSpecifiers(body, '\\s*:\\s*'),
      multiline: body.includes('\n'),
      render: (list, isBrand) =>
        `${indent}${kind} ${list} = require(${quote}${isBrand ? TARGETS[source] : source}${quote})${semi}`,
    });
    if (!result) return statement;
    moved.push(...result.moved);
    return result.code;
  });

  for (const [, namespace] of code.matchAll(NAMESPACE)) {
    for (const name of BRAND_NAMES) {
      if (new RegExp(`\\b${namespace}\\.${name}\\b`).test(code)) {
        warnings.push(`${namespace}.${name} (namespace import, change it by hand)`);
      }
    }
  }

  return { code: output, moved, warnings };
}
