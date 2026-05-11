# Tailwind v4 Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Tailwind v3 plugin with a `@theme inline` CSS block so miksin-ui works natively with Tailwind v4, while keeping plain CSS usage working.

**Architecture:** Add `src/theme-v4.css` containing `@theme inline { ... }` that maps all design tokens to Tailwind v4 utilities. Delete `tailwind.js` (v3 plugin). Update package exports to point to CSS only. Update the docs site to import miksin-ui CSS directly instead of via the v3 plugin.

**Tech Stack:** PostCSS (postcss-import, postcss-nesting, autoprefixer), Tailwind v4 `@theme inline`, Astro v4, Tailwind v3 (docs site only, unchanged)

---

## File Map

| File | Action |
|---|---|
| `packages/miksin-ui/src/theme-v4.css` | **Create** — `@theme inline` block |
| `packages/miksin-ui/src/index.css` | **Modify** — add import of theme-v4.css |
| `packages/miksin-ui/test/output.test.mjs` | **Modify** — add @theme inline assertions |
| `packages/miksin-ui/package.json` | **Modify** — update exports, main, files, remove v3 peer dep |
| `packages/miksin-ui/tailwind.js` | **Delete** |
| `apps/docs/src/layouts/Layout.astro` | **Modify** — add direct CSS import |
| `apps/docs/tailwind.config.mjs` | **Modify** — remove miksin-ui plugin |
| `apps/docs/src/pages/index.astro` | **Modify** — replace v3 plugin usage example with v4 |
| `README.md` | **Modify** — replace v3 plugin section with v4 CSS import |
| `packages/miksin-ui/README.md` | **Modify** — same |

---

## Task 1: Add failing @theme test, implement theme-v4.css, rebuild

**Files:**
- Modify: `packages/miksin-ui/test/output.test.mjs:14-21`
- Create: `packages/miksin-ui/src/theme-v4.css`
- Modify: `packages/miksin-ui/src/index.css:1-8`

- [ ] **Step 1: Add failing tests for @theme inline to the test file**

Open `packages/miksin-ui/test/output.test.mjs` and add these two tests after the existing `'CSS variables defined'` test (after line 21):

```js
test('@theme inline block present', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('@theme inline'), '@theme inline block missing from dist')
})

test('@theme inline exposes all tokens', () => {
  const css = readFileSync(distPath, 'utf-8')
  const themeMatch = css.match(/@theme inline\s*\{([^}]+)\}/)
  assert.ok(themeMatch, '@theme inline block not found or malformed')
  const block = themeMatch[1]
  const tokens = [
    '--color-primary-500', '--color-secondary-500', '--color-success-500',
    '--color-warning-500', '--color-error-500',
    '--color-neutral-50', '--color-neutral-900',
    '--color-bg', '--color-fg', '--color-primary', '--color-primary-text',
    '--color-secondary', '--color-success', '--color-warning', '--color-error',
    '--color-border', '--color-muted', '--color-muted-fg',
    '--radius-base',
  ]
  for (const token of tokens) {
    assert.ok(block.includes(token), `${token} missing from @theme inline block`)
  }
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm --filter miksin-ui test
```

Expected: 2 new failures — `@theme inline block present` and `@theme inline exposes all tokens` both fail with assertion errors. Existing 7 tests pass.

- [ ] **Step 3: Create `packages/miksin-ui/src/theme-v4.css`**

```css
@theme inline {
  /* Primitive colors */
  --color-primary-500:   var(--color-primary-500);
  --color-secondary-500: var(--color-secondary-500);
  --color-success-500:   var(--color-success-500);
  --color-warning-500:   var(--color-warning-500);
  --color-error-500:     var(--color-error-500);
  --color-neutral-50:    var(--color-neutral-50);
  --color-neutral-900:   var(--color-neutral-900);

  /* Semantic colors */
  --color-bg:           var(--color-bg);
  --color-fg:           var(--color-fg);
  --color-primary:      var(--color-primary);
  --color-primary-text: var(--color-primary-text);
  --color-secondary:    var(--color-secondary);
  --color-success:      var(--color-success);
  --color-warning:      var(--color-warning);
  --color-error:        var(--color-error);
  --color-border:       var(--color-border);
  --color-muted:        var(--color-muted);
  --color-muted-fg:     var(--color-muted-fg);

  /* Radius */
  --radius-base: var(--radius-base);
}
```

- [ ] **Step 4: Update `packages/miksin-ui/src/index.css` to import the new file**

Replace the entire file with:

```css
@import './base.css';
@import './theme-v4.css';
@import './components/button.css';
@import './components/badge.css';
@import './components/form.css';
@import './components/checkbox.css';
@import './components/toggle.css';
@import './components/card.css';
@import './components/container.css';
```

- [ ] **Step 5: Build**

```bash
pnpm --filter miksin-ui build
```

Expected: exits 0, `packages/miksin-ui/dist/miksin-ui.css` updated.

- [ ] **Step 6: Run tests to verify all pass**

```bash
pnpm --filter miksin-ui test
```

Expected: 9 tests pass, 0 failures.

- [ ] **Step 7: Commit**

```bash
git add packages/miksin-ui/src/theme-v4.css packages/miksin-ui/src/index.css packages/miksin-ui/test/output.test.mjs packages/miksin-ui/dist/miksin-ui.css
git commit -m "feat: add @theme inline block for Tailwind v4 token utilities"
```

---

## Task 2: Clean up package.json and delete tailwind.js

**Files:**
- Modify: `packages/miksin-ui/package.json`
- Delete: `packages/miksin-ui/tailwind.js`

- [ ] **Step 1: Replace `packages/miksin-ui/package.json` with the v4-only version**

```json
{
  "name": "miksin-ui",
  "version": "0.1.0",
  "description": "Token-based CSS design system",
  "main": "./dist/miksin-ui.css",
  "exports": {
    ".": "./dist/miksin-ui.css",
    "./dist/miksin-ui.css": "./dist/miksin-ui.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "postcss src/index.css -o dist/miksin-ui.css",
    "test": "node --test test/output.test.mjs",
    "prepublishOnly": "pnpm build && pnpm test"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "postcss-cli": "^11.0.0",
    "postcss-import": "^16.0.0",
    "postcss-nesting": "^12.0.0"
  }
}
```

Changes from before: `main` points to CSS, `exports` removes `./tailwind`, `files` removes `tailwind.js`, `postcss` moved from `dependencies` to `devDependencies`, removed `tailwindcss` devDep and all `peerDependencies`.

- [ ] **Step 2: Delete `tailwind.js` (use git rm so the deletion is staged)**

```bash
git rm packages/miksin-ui/tailwind.js
```

Expected: `rm 'packages/miksin-ui/tailwind.js'`

- [ ] **Step 3: Run tests to verify nothing broke**

```bash
pnpm --filter miksin-ui test
```

Expected: 9 tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/miksin-ui/package.json
git commit -m "chore: drop Tailwind v3 plugin, point exports to CSS only"
```

---

## Task 3: Update the docs site to import miksin-ui CSS directly

The docs site (`apps/docs`) uses Tailwind v3 via `@astrojs/tailwind` for its own utility classes (`text-3xl`, `flex`, etc.). It previously loaded miksin-ui CSS via the v3 plugin. Since the plugin is gone, we import the CSS directly in the Astro layout.

**Files:**
- Modify: `apps/docs/src/layouts/Layout.astro:2`
- Modify: `apps/docs/tailwind.config.mjs`

- [ ] **Step 1: Add direct miksin-ui CSS import to `apps/docs/src/layouts/Layout.astro`**

Line 2 currently reads: `import '../styles/global.css'`

Add a second import on line 3:

```diff
 import '../styles/global.css'
+import 'miksin-ui/dist/miksin-ui.css'
```

The full frontmatter block becomes:
```astro
---
import '../styles/global.css'
import 'miksin-ui/dist/miksin-ui.css'
const { title = 'miksin-ui' } = Astro.props
...
```

- [ ] **Step 2: Update `apps/docs/tailwind.config.mjs` to remove the miksin-ui plugin**

Replace the entire file with:

```js
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  corePlugins: { container: false },
}
```

(Remove the `import miksinui from 'miksin-ui/tailwind'` line and `plugins: [miksinui]`.)

- [ ] **Step 3: Build miksin-ui first (docs imports from its dist)**

```bash
pnpm --filter miksin-ui build
```

Expected: exits 0.

- [ ] **Step 4: Build the docs site**

```bash
pnpm --filter docs build
```

Expected: exits 0, all 8 pages built. If it errors with a module not found for `miksin-ui/tailwind`, confirm step 2 was applied correctly.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/layouts/Layout.astro apps/docs/tailwind.config.mjs
git commit -m "chore(docs): import miksin-ui CSS directly, remove v3 Tailwind plugin"
```

---

## Task 4: Update docs content and READMEs

Replace all references to the Tailwind v3 plugin with the Tailwind v4 CSS import pattern.

**Files:**
- Modify: `apps/docs/src/pages/index.astro:20-28`
- Modify: `README.md`
- Modify: `packages/miksin-ui/README.md`

- [ ] **Step 1: Update `apps/docs/src/pages/index.astro` — replace the v3 plugin section**

Lines 20–28 currently show a v3 `tailwind.config.js` plugin example. Replace that entire `<h2>Usage — Tailwind plugin</h2>` block with a v4 section:

```astro
  <h2 class="text-2xl font-semibold mt-10 mb-4">Usage — Tailwind v4</h2>
  <p class="mb-3" style="color: var(--color-muted-fg);">Import the CSS after Tailwind. Token utilities (<code>bg-primary</code>, <code>text-fg</code>, <code>rounded-base</code>, etc.) are generated automatically.</p>
  <CodeBlock code={`/* app.css */
@import "tailwindcss";
@import "miksin-ui/dist/miksin-ui.css";`} />
```

- [ ] **Step 2: Update the "Usage — Tailwind plugin" section in root `README.md`**

Find the section:

```markdown
### Tailwind v3 plugin

Registers all component classes and bridges design tokens into Tailwind's theme.

```js
// tailwind.config.js
import miksinui from 'miksin-ui/tailwind'

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,astro,vue,svelte}'],
  plugins: [miksinui],
}
```
```

Replace it with:

```markdown
### Tailwind v4

Import the CSS after Tailwind. Token utilities (`bg-primary`, `text-fg`, `border-border`, `rounded-base`, etc.) are generated automatically from the `@theme inline` block.

```css
/* app.css */
@import "tailwindcss";
@import "miksin-ui/dist/miksin-ui.css";
```
```

- [ ] **Step 3: Update the same section in `packages/miksin-ui/README.md`**

Find:

```markdown
### With Tailwind v3

```js
// tailwind.config.js
import miksinui from 'miksin-ui/tailwind'

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,astro,vue,svelte}'],
  plugins: [miksinui],
}
```
```

Replace with:

```markdown
### With Tailwind v4

```css
/* app.css */
@import "tailwindcss";
@import "miksin-ui/dist/miksin-ui.css";
```

Token utilities (`bg-primary`, `text-fg`, `border-border`, `rounded-base`, etc.) are generated automatically.
```

- [ ] **Step 4: Build docs to verify changes render correctly**

```bash
pnpm --filter miksin-ui build && pnpm --filter docs build
```

Expected: exits 0, 8 pages built.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/pages/index.astro README.md packages/miksin-ui/README.md
git commit -m "docs: update usage instructions from Tailwind v3 plugin to v4 CSS import"
```
