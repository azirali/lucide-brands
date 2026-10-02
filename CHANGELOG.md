# Changelog

## Unreleased

- `migrate` now also handles Vue (`@lucide/vue` / `lucide-vue-next` → `lucide-brands/vue`, including `.vue` files), `export … from` re-exports and `require()` destructuring.
- `lucide-brands/vue`: the icons as `@lucide/vue` components (`Github`, `GithubIcon`, `LucideGithub`, …).
- All peer dependencies are now optional, so a Vue project doesn't get React warnings.
- `lucide-brands/nodes`: the icons as plain icon nodes with no framework dependency, for `lucide` (`createIcons`), `@lucide/svelte` (`<Icon iconNode>`) and friends.

## 1.1.0

- `npx lucide-brands migrate`: moves brand icon imports from `lucide-react` to `lucide-brands` across a whole project (`--dry-run` to preview).
- Live demo in `examples/vite-react`, with an "Open in StackBlitz" link in the README.

## 1.0.0

- The 17 brand icons removed in lucide-react 1.1.0, generated from lucide-react 1.0.0: Chromium (Chrome), Codepen, Codesandbox, Dribbble, Facebook, Figma, Framer, Github, Gitlab, Instagram, Linkedin, Pocket, Slack, Trello, Twitch, Twitter, Youtube.
