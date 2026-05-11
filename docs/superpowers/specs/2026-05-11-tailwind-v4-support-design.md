# Tailwind v4 Support Design

**Goal:** Replace the Tailwind v3 plugin with a pure-CSS Tailwind v4 integration while keeping plain-CSS usage working.

**Architecture:** Ship a single `dist/miksin-ui.css` that includes an `@theme inline {}` block so Tailwind v4 generates utility classes from miksin-ui's tokens. The v3 plugin (`tailwind.js`) is deleted. No JS config is needed by consumers.

**Tech Stack:** PostCSS (postcss-import, postcss-nesting, autoprefixer), Tailwind v4 `@theme inline`

---

## How It Works

Tailwind v4 scans all CSS imported into the project for `@theme` blocks and generates utilities from them. By adding `@theme inline { --color-primary: var(--color-primary); ... }` to the dist CSS, consumers get `bg-primary`, `text-primary`, `border-primary`, `rounded-base`, etc. automatically — no JS config file required.

`@theme inline` means "keep values as `var()` references in generated CSS rather than inlining the literal value." This is required for runtime theming (dark mode via `data-theme="dark"`, user `:root` overrides).

The `@theme` block is a Tailwind directive that non-Tailwind CSS processors skip entirely, so plain CSS imports continue to work unchanged.

---

## Tailwind v4 Usage

```css
/* app.css */
@import "tailwindcss";
@import "miksin-ui/dist/miksin-ui.css";
```

Generated utilities from tokens:

| Token | Utilities |
|---|---|
| `--color-bg` | `bg-bg`, `text-bg`, `border-bg` |
| `--color-fg` | `text-fg`, `bg-fg`, `border-fg` |
| `--color-primary` | `bg-primary`, `text-primary`, `border-primary`, `ring-primary` |
| `--color-primary-text` | `text-primary-text` |
| `--color-secondary` | `bg-secondary`, `text-secondary`, `border-secondary` |
| `--color-success` | `bg-success`, `text-success`, `border-success` |
| `--color-warning` | `bg-warning`, `text-warning`, `border-warning` |
| `--color-error` | `bg-error`, `text-error`, `border-error` |
| `--color-border` | `border-border`, `bg-border` |
| `--color-muted` | `bg-muted`, `border-muted` |
| `--color-muted-fg` | `text-muted-fg` |
| `--color-primary-500` | `bg-primary-500`, `text-primary-500` |
| `--color-secondary-500` | `bg-secondary-500` |
| `--color-success-500` | `bg-success-500` |
| `--color-warning-500` | `bg-warning-500` |
| `--color-error-500` | `bg-error-500` |
| `--color-neutral-50` | `bg-neutral-50`, `text-neutral-50` |
| `--color-neutral-900` | `bg-neutral-900`, `text-neutral-900` |
| `--radius-base` | `rounded-base` |

Component tokens (`--btn-radius`, `--card-padding`, `--card-shadow`) are **not** in `@theme` — they are internal to component classes only.

---

## Plain CSS Usage (unchanged)

```html
<link rel="stylesheet" href="node_modules/miksin-ui/dist/miksin-ui.css">
```

or

```js
import 'miksin-ui/dist/miksin-ui.css'
```

Component classes (`.btn`, `.card`, `.input`, etc.) and CSS variable tokens work as before. The `@theme` block is ignored.

---

## File Changes

### New: `src/theme-v4.css`

```css
@theme inline {
  --color-primary-500:   var(--color-primary-500);
  --color-secondary-500: var(--color-secondary-500);
  --color-success-500:   var(--color-success-500);
  --color-warning-500:   var(--color-warning-500);
  --color-error-500:     var(--color-error-500);
  --color-neutral-50:    var(--color-neutral-50);
  --color-neutral-900:   var(--color-neutral-900);

  --color-bg:            var(--color-bg);
  --color-fg:            var(--color-fg);
  --color-primary:       var(--color-primary);
  --color-primary-text:  var(--color-primary-text);
  --color-secondary:     var(--color-secondary);
  --color-success:       var(--color-success);
  --color-warning:       var(--color-warning);
  --color-error:         var(--color-error);
  --color-border:        var(--color-border);
  --color-muted:         var(--color-muted);
  --color-muted-fg:      var(--color-muted-fg);

  --radius-base: var(--radius-base);
}
```

### Updated: `src/index.css`

Add `@import './theme-v4.css';` after `@import './base.css';`.

### Deleted: `tailwind.js`

The v3 plugin is removed entirely.

### Updated: `package.json`

```json
{
  "main": "./dist/miksin-ui.css",
  "exports": {
    ".": "./dist/miksin-ui.css",
    "./dist/miksin-ui.css": "./dist/miksin-ui.css"
  },
  "files": ["dist"]
}
```

### Updated: `test/output.test.mjs`

- Add assertion: `@theme inline` block is present in dist output
- Add assertion: all semantic token names appear in the `@theme` block
- Remove: any assertions referencing `tailwind.js` or v3 plugin behaviour
- Keep: existing assertions for component class names in dist

### Updated: `README.md` and `packages/miksin-ui/README.md`

Replace v3 plugin install instructions with v4 CSS import.

### Updated: `apps/docs/src/pages/index.astro`

Replace v3 Tailwind plugin code example with v4 CSS import example.

---

## What Is Not Changing

- `src/base.css` — token values and dark mode overrides are unchanged
- All component CSS files — component classes are unchanged
- PostCSS build pipeline — postcss-import, postcss-nesting, autoprefixer are unchanged
- Dark mode mechanism — `data-theme="dark"` attribute, unchanged
- Theming via `:root` overrides — unchanged
