# lucide-brands

[![npm](https://img.shields.io/npm/v/lucide-brands)](https://www.npmjs.com/package/lucide-brands)
[![CI](https://github.com/azirali/lucide-brands/actions/workflows/ci.yml/badge.svg)](https://github.com/azirali/lucide-brands/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/lucide-brands)](https://bundlephobia.com/package/lucide-brands)
[![license](https://img.shields.io/npm/l/lucide-brands)](./LICENSE)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/azirali/lucide-brands/tree/main/examples/vite-react?file=src%2Fmain.jsx)

**The brand icons that `lucide-react` 1.1 removed, back as drop-in React components.**

Upgraded `lucide-react` and got this?

```
Module '"lucide-react"' has no exported member 'Github'.
```

Starting with **lucide-react 1.1.0**, `Github`, `Twitter`, `Linkedin`, `Youtube`, `Instagram`, `Facebook` and the other brand icons are gone. This package brings back all 17 of them, **pixel-identical to lucide-react 1.0.0**, built with lucide's own `createLucideIcon`, so they behave exactly like every other lucide icon.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/preview-dark.svg">
  <img alt="Chromium, Codepen, Codesandbox, Dribbble, Facebook, Figma, Framer, Github, Gitlab, Instagram, Linkedin, Pocket, Slack, Trello, Twitch, Twitter, Youtube" src=".github/preview-light.svg">
</picture>

## Quick fix: one command

```sh
npm install lucide-brands
npx lucide-brands migrate
```

`migrate` scans your project (skipping `node_modules`, `dist`, `build`, …) and moves every brand icon from your `lucide-react` imports to `lucide-brands`. All other imports stay as they are:

```
✓ src/components/Footer.tsx: Github, Linkedin, Instagram
✓ src/components/Team.tsx: Github, Linkedin

Updated 2 file(s): Github, Instagram, Linkedin
```

Run `npx lucide-brands migrate --dry-run` first to see what would change, or pass a folder: `npx lucide-brands migrate src`. It handles `import`, `export … from` and `require()`, multi-line imports, aliases (`Github as GithubLogo`), the `GithubIcon`/`LucideGithub` names and `type` imports. In Vue projects it moves icons from `@lucide/vue` or `lucide-vue-next` to `lucide-brands/vue`, including inside `.vue` files. For `import * as Icons from 'lucide-react'` it prints a warning instead of guessing.

To keep brand icons from creeping back into `lucide-react` imports, add `npx lucide-brands migrate --check` to CI. It exits with code 1 and lists the files if anything would change.

`lucide-react` (1.x) and `react` are peer dependencies; you already have them. For Vue you need `@lucide/vue` and `vue` instead. All peer dependencies are optional, so you only install the ones for your framework.

## Or migrate by hand

```diff
- import { Github, Linkedin, Mail } from 'lucide-react';
+ import { Mail } from 'lucide-react';
+ import { Github, Linkedin } from 'lucide-brands';
```

Nothing else changes:

```tsx
<Github size={20} strokeWidth={1.5} className="text-muted-foreground" />
```

- Same props: `size`, `color`, `strokeWidth`, `absoluteStrokeWidth`, `className`, and any SVG attribute
- Same output: `<svg class="lucide lucide-github">…`, so your CSS keeps working
- Respects `<LucideProvider>` defaults, because the icons are created by lucide-react itself
- Same aliases: `Github`, `GithubIcon`, `LucideGithub` (and `Chrome` for `Chromium`)
- Tree-shakeable: importing `Github` ships only `Github` (~0.3 kB gzipped, checked in CI by `npm run size`)
- ESM + CommonJS, TypeScript types included

## Icons

| Component | Aliases |
| --- | --- |
| `Chromium` | `Chrome`, `ChromiumIcon`, `LucideChromium`, `ChromeIcon`, `LucideChrome` |
| `Codepen` | `CodepenIcon`, `LucideCodepen` |
| `Codesandbox` | `CodesandboxIcon`, `LucideCodesandbox` |
| `Dribbble` | `DribbbleIcon`, `LucideDribbble` |
| `Facebook` | `FacebookIcon`, `LucideFacebook` |
| `Figma` | `FigmaIcon`, `LucideFigma` |
| `Framer` | `FramerIcon`, `LucideFramer` |
| `Github` | `GithubIcon`, `LucideGithub` |
| `Gitlab` | `GitlabIcon`, `LucideGitlab` |
| `Instagram` | `InstagramIcon`, `LucideInstagram` |
| `Linkedin` | `LinkedinIcon`, `LucideLinkedin` |
| `Pocket` | `PocketIcon`, `LucidePocket` |
| `Slack` | `SlackIcon`, `LucideSlack` |
| `Trello` | `TrelloIcon`, `LucideTrello` |
| `Twitch` | `TwitchIcon`, `LucideTwitch` |
| `Twitter` | `TwitterIcon`, `LucideTwitter` |
| `Youtube` | `YoutubeIcon`, `LucideYoutube` |

## Vue

`lucide-brands/vue` has the same icons as components for [`@lucide/vue`](https://lucide.dev/guide/packages/lucide-vue-next):

```vue
<script setup>
import { Mail } from '@lucide/vue';
import { Github, Linkedin } from 'lucide-brands/vue';
</script>

<template>
  <Github :size="20" />
  <Linkedin class="text-muted" />
  <Mail />
</template>
```

They're created with `@lucide/vue`'s own `createLucideIcon`, so props and classes work like any other lucide icon.

## Other frameworks

`lucide-brands/nodes` exports the same icons as plain icon nodes, with no framework dependency. They plug into lucide's other packages.

**Vanilla JS** with [`lucide`](https://lucide.dev/guide/packages/lucide):

```html
<i data-lucide="github"></i>
<i data-lucide="linkedin"></i>
```

```js
import { createIcons, Mail } from 'lucide';
import { Github, Linkedin } from 'lucide-brands/nodes';

createIcons({ icons: { Mail, Github, Linkedin } });
```

**Svelte** with [`@lucide/svelte`](https://lucide.dev/guide/packages/lucide-svelte):

```svelte
<script>
  import { Icon } from '@lucide/svelte';
  import { Github } from 'lucide-brands/nodes';
</script>

<Icon iconNode={Github} size={20} />
```

**Plain SVG files** ship in the package too, if you just need the markup:

```js
import githubSvg from 'lucide-brands/svg/github.svg';
```

## Why were they removed?

Lucide doesn't take brand logos (requests are closed with the "brand request" label), and 1.1.0 dropped the few that were left. That's a reasonable call for an icon set, but it breaks a lot of footers and "Sign in with GitHub" buttons on upgrade. This package is the lowest-effort way to upgrade without redrawing anything.

If you need official, full-color or many more brand logos, use [Simple Icons](https://simpleicons.org) instead. This package intentionally contains only the lucide-styled outline icons that used to ship with lucide.

## How it's verified

Every icon is generated from `lucide-react@1.0.0` by [`scripts/generate.mjs`](./scripts/generate.mjs), and the tests render each one next to the original 1.0.0 component, with and without props, and require **identical markup**. CI runs them against the latest `lucide-react` and React 18/19.

## License

[ISC](./LICENSE). The icon artwork comes from [Lucide](https://lucide.dev) (ISC, © Lucide Contributors).

All product names and logos are trademarks of their respective owners. Their use here doesn't imply any affiliation or endorsement.
