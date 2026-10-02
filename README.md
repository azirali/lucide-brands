# lucide-brands

[![npm](https://img.shields.io/npm/v/lucide-brands)](https://www.npmjs.com/package/lucide-brands)
[![CI](https://github.com/azirali/lucide-brands/actions/workflows/ci.yml/badge.svg)](https://github.com/azirali/lucide-brands/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/lucide-brands)](https://bundlephobia.com/package/lucide-brands)
[![license](https://img.shields.io/npm/l/lucide-brands)](./LICENSE)

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

## Install

```sh
npm install lucide-brands
```

`lucide-react` (1.x) and `react` are peer dependencies. You already have them.

## Migrate in one line

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
- Tree-shakeable: importing `Github` ships only `Github` (~0.3 kB gzipped)
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

### Raw SVG and icon nodes

Not using React? The original SVG files ship in the package:

```js
import githubSvg from 'lucide-brands/svg/github.svg';
```

The icon node of each icon is exported too (`githubIconNode`, `youtubeIconNode`, …), so you can feed it to `lucide`, `@lucide/vue`, `@lucide/svelte` or your own renderer.

## Why were they removed?

Lucide doesn't take brand logos (requests are closed with the "brand request" label), and 1.1.0 dropped the few that were left. That's a reasonable call for an icon set, but it breaks a lot of footers and "Sign in with GitHub" buttons on upgrade. This package is the lowest-effort way to upgrade without redrawing anything.

If you need official, full-color or many more brand logos, use [Simple Icons](https://simpleicons.org) instead. This package intentionally contains only the lucide-styled outline icons that used to ship with lucide.

## How it's verified

Every icon is generated from `lucide-react@1.0.0` by [`scripts/generate.mjs`](./scripts/generate.mjs), and the tests render each one next to the original 1.0.0 component, with and without props, and require **identical markup**. CI runs them against the latest `lucide-react` and React 18/19.

## License

[ISC](./LICENSE). The icon artwork comes from [Lucide](https://lucide.dev) (ISC, © Lucide Contributors).

All product names and logos are trademarks of their respective owners. Their use here doesn't imply any affiliation or endorsement.
