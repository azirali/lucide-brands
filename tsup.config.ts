import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/nodes.ts', 'src/vue.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'lucide-react', 'vue', '@lucide/vue'],
});
