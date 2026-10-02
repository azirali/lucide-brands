// Fails if importing a single icon from any entry costs more than its budget (min+gzip),
// i.e. if tree-shaking breaks or an entry starts pulling in everything.
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

const ENTRIES = [
  { entry: 'lucide-brands', name: 'Github', external: ['react', 'lucide-react'], budget: 600 },
  { entry: 'lucide-brands/vue', name: 'Github', external: ['vue', '@lucide/vue'], budget: 600 },
  { entry: 'lucide-brands/nodes', name: 'Github', external: [], budget: 500 },
  { entry: 'lucide-brands', name: '*', external: ['react', 'lucide-react'], budget: 4000 },
];

let failed = false;
for (const { entry, name, external, budget } of ENTRIES) {
  const contents =
    name === '*' ? `export * from '${entry}';` : `import { ${name} } from '${entry}'; console.log(${name});`;
  const result = await build({
    stdin: { contents, resolveDir: process.cwd() },
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    external,
    logLevel: 'silent',
  });
  const size = gzipSync(result.outputFiles[0].contents).length;
  const ok = size <= budget;
  failed ||= !ok;
  const label = name === '*' ? `all icons from ${entry}` : `{ ${name} } from ${entry}`;
  console.log(`${ok ? '✓' : '✗'} ${label}: ${size} B gzip (budget ${budget} B)`);
}
process.exit(failed ? 1 : 0);
