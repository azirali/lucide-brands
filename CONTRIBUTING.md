# Contributing

Thanks for helping out! Bug reports, framework support and `migrate` improvements are all welcome.

## Setup

```sh
npm ci
npm test          # vitest: icon markup vs lucide-react 1.0.0, aliases, migrate CLI
npm run typecheck
npm run build     # tsup -> dist/
```

## How the package is built

- `scripts/generate.mjs` reads the icon nodes from `lucide-react@1.0.0` (installed as the `lucide-react-1.0.0` dev dependency) and writes `src/icons/*.ts`, `src/index.ts`, `svg/*.svg` and `cli/names.json`. Those files are generated: change the script and run `npm run generate` instead of editing them by hand.
- `scripts/preview.mjs` renders the README preview images from `svg/`.
- `cli/` is the `npx lucide-brands migrate` codemod. It's plain ESM with no dependencies, so it runs without a build step.

## Scope

The package intentionally contains only the 17 icons lucide-react shipped up to 1.0.0, in lucide's style. Requests for new logos are out of scope. [Simple Icons](https://simpleicons.org) covers those much better.

## Pull requests

Keep PRs focused, add a test for behavior changes, and make sure CI is green.
