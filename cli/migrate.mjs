import { readFileSync } from 'node:fs';

export const BRAND_NAMES = new Set(
  JSON.parse(readFileSync(new URL('./names.json', import.meta.url), 'utf8')),
);

// import { A, type B, C as D } from 'lucide-react';   (also `import type { ... }`)
const NAMED_IMPORT =
  /^([ \t]*)import(\s+type)?\s*\{([^}]*)\}\s*from\s*(['"])lucide-react\4(\s*;)?/gm;
// import * as Icons from 'lucide-react';
const NAMESPACE_IMPORT = /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]lucide-react['"]/g;

function parseSpecifiers(body) {
  return body
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((text) => {
      const match = /^(type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(text);
      return { text, imported: match ? match[2] : null };
    });
}

const formatImport = (indent, typeOnly, specifiers, quote, semi, source) =>
  `${indent}import${typeOnly ?? ''} { ${specifiers.join(', ')} } from ${quote}${source}${quote}${semi ?? ''}`;

/**
 * Moves brand icon imports from 'lucide-react' to 'lucide-brands'.
 * Returns the new source, the names that were moved, and warnings for
 * usages it can't rewrite safely (namespace imports).
 */
export function migrateSource(code) {
  const moved = [];
  const warnings = [];

  const output = code.replace(NAMED_IMPORT, (statement, indent, typeOnly, body, quote, semi) => {
    const specifiers = parseSpecifiers(body);
    const brands = specifiers.filter((s) => s.imported && BRAND_NAMES.has(s.imported));
    if (brands.length === 0) return statement;

    moved.push(...brands.map((s) => s.imported));
    const rest = specifiers.filter((s) => !brands.includes(s));
    const brandImport = formatImport(indent, typeOnly, brands.map((s) => s.text), quote, semi, 'lucide-brands');
    if (rest.length === 0) return brandImport;

    const multiline = body.includes('\n');
    const restImport = multiline
      ? `${indent}import${typeOnly ?? ''} {\n${rest.map((s) => `${indent}  ${s.text},`).join('\n')}\n${indent}} from ${quote}lucide-react${quote}${semi ?? ''}`
      : formatImport(indent, typeOnly, rest.map((s) => s.text), quote, semi, 'lucide-react');
    return `${restImport}\n${brandImport}`;
  });

  for (const [, namespace] of code.matchAll(NAMESPACE_IMPORT)) {
    for (const name of BRAND_NAMES) {
      if (new RegExp(`\\b${namespace}\\.${name}\\b`).test(code)) {
        warnings.push(`${namespace}.${name} (namespace import, change it by hand)`);
      }
    }
  }

  return { code: output, moved, warnings };
}
