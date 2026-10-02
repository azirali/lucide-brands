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

## Releasing

1. Bump `version` in `package.json` and move the `Unreleased` notes in `CHANGELOG.md` under the new version, in a PR.
2. After it's merged, create a GitHub Release with the tag `vX.Y.Z` (same version) and the changelog notes.
3. The `Release` workflow checks that the tag matches `package.json`, runs `prepublishOnly` (typecheck, tests, build) and publishes to npm with provenance.

The workflow uses npm trusted publishing, so no token is stored in the repo. The npm package must list this repository and `release.yml` (environment `npm`) as a trusted publisher.

## Pull requests

Keep PRs focused, add a test for behavior changes, and make sure CI is green.
