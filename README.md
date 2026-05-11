# miksin-ui

A personal token-based CSS design system. Pure CSS classes that work with any JS framework, with an optional Tailwind v3 plugin.

## Install

```bash
npm install miksin-ui
```

## Usage

### CSS import

Works with any framework — import the stylesheet and use the classes directly.

```js
import 'miksin-ui/dist/miksin-ui.css'
```

```html
<button class="btn">Button</button>
<span class="badge">Label</span>
```

### Tailwind v4

Import the CSS after Tailwind. Token utilities (`bg-primary`, `text-fg`, `border-border`, `rounded-base`, etc.) are generated automatically from the `@theme inline` block.

```css
/* app.css */
@import "tailwindcss";
@import "miksin-ui/dist/miksin-ui.css";
```

## Components

| Class | Element | Notes |
|---|---|---|
| `.btn` | `<button>` | Default (primary fill) |
| `.btn-outline` | `<button>` | Outlined variant |
| `.btn-ghost` | `<button>` | No border or background |
| `.btn-sm` / `.btn-lg` | `<button>` | Size variants |
| `.badge` | `<span>` | Inline label (primary fill) |
| `.badge-outline` | `<span>` | Outlined variant |
| `.badge-sm` | `<span>` | Smaller size |
| `.input` | `<input>` | Text input |
| `.select` | `<select>` | Select dropdown |
| `.textarea` | `<textarea>` | Multi-line input |
| `.checkbox` | `<input type="checkbox">` | Styled checkbox |
| `.radio` | `<input type="radio">` | Styled radio button |
| `.toggle` | `<input type="checkbox">` | On/off switch |
| `.card` | `<div>` | Card container |
| `.card-header` / `.card-body` / `.card-footer` | `<div>` | Card sections |
| `.container` | `<div>` | Centered page wrapper |
| `.divider` | `<hr>` | Horizontal separator |

## Theming

Override any CSS variable in your own stylesheet to customize the system.

```css
:root {
  /* Brand colors — OKLCH recommended for perceptual uniformity */
  --color-primary-500:   oklch(58% 0.22 145); /* green */
  --color-secondary-500: oklch(65% 0.18 260); /* blue */

  /* Shape */
  --radius-base: 0.5rem;
}
```

Semantic and component tokens are derived from primitives, so changing a single primitive updates all components that use it. Fine-grained overrides are also available:

```css
:root {
  --btn-radius:   0.25rem; /* override just buttons */
  --card-padding: 2rem;
}
```

See the [full token reference](https://miksin.github.io/miksin-ui/tokens/) for all available tokens.

## Dark mode

Add `data-theme="dark"` to any ancestor element (typically `<html>`) to activate dark mode. No JavaScript required — pure CSS.

```html
<html data-theme="dark">
```

To persist the preference across page loads, set the attribute before first paint to avoid a flash:

```html
<script>
  if (localStorage.getItem('theme') === 'dark')
    document.documentElement.setAttribute('data-theme', 'dark')
</script>
```

## Development

This is a pnpm monorepo.

```
packages/miksin-ui/   — the CSS library and Tailwind plugin
apps/docs/            — Astro documentation site
tools/                — build utilities
```

```bash
# Install dependencies
pnpm install

# Build the CSS library
pnpm --filter miksin-ui build

# Run tests
pnpm --filter miksin-ui test

# Start docs dev server (auto-generates token data from source)
pnpm --filter docs dev

# Build docs for deployment
pnpm --filter miksin-ui build && pnpm --filter docs build
```

## License

MIT
