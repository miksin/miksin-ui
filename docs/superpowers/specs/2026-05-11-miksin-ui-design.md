# miksin-ui Design Spec

**Date:** 2026-05-11  
**Status:** Approved

## Overview

`miksin-ui` is a personal CSS design system — a publishable npm package containing token-based component styles that work with any JS framework. Tailwind-compatible, with a thin Tailwind plugin as an optional integration layer.

Reference: similar philosophy to daisyUI (pure CSS classes), but fully token-driven (CSS variables control all visual decisions, no hardcoded colors or styles).

---

## Goals

- CSS-only component classes: `btn`, `card`, `input`, etc. — usable in React, Vue, Svelte, plain HTML
- Token-based theming: override `:root` CSS variables to change the entire look
- Two usage modes: standalone CSS import OR Tailwind plugin
- Astro static site for documentation and live demos
- Publishable to npm as `miksin-ui`

---

## Project Structure

```
miksin-ui/
├── packages/
│   └── miksin-ui/
│       ├── src/
│       │   ├── base.css              # CSS variable token definitions
│       │   ├── components/
│       │   │   ├── button.css
│       │   │   ├── badge.css
│       │   │   ├── form.css          # input, select, textarea
│       │   │   ├── checkbox.css
│       │   │   ├── toggle.css
│       │   │   ├── card.css
│       │   │   └── container.css
│       │   └── index.css             # @import all components
│       ├── tailwind.js               # Tailwind plugin entry
│       ├── dist/
│       │   └── miksin-ui.css         # PostCSS build output
│       └── package.json
├── apps/
│   └── docs/                         # Astro documentation site
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro
│       │   │   ├── tokens.astro
│       │   │   └── components/
│       │   │       ├── button.astro
│       │   │       ├── badge.astro
│       │   │       ├── input.astro
│       │   │       ├── checkbox.astro
│       │   │       ├── toggle.astro
│       │   │       └── card.astro
│       │   └── components/
│       │       ├── Demo.astro
│       │       └── CodeBlock.astro
│       └── package.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Token System

Three-layer token hierarchy. Users only need to override the primitive or semantic layer.

```css
:root {
  /* Primitive tokens */
  --color-primary-500: oklch(55% 0.2 250);
  --color-neutral-50:  oklch(98% 0 0);
  --color-neutral-900: oklch(15% 0 0);
  --radius-base: 0.375rem;

  /* Semantic tokens — used by components */
  --color-bg:           var(--color-neutral-50);
  --color-fg:           var(--color-neutral-900);
  --color-primary:      var(--color-primary-500);
  --color-primary-text: oklch(98% 0 0);
  --color-border:       oklch(88% 0 0);
  --color-muted:        oklch(92% 0 0);
  --color-muted-fg:     oklch(45% 0 0);

  /* Component tokens */
  --btn-radius:   var(--radius-base);
  --input-radius: var(--radius-base);
  --card-radius:  calc(var(--radius-base) * 2);
}

[data-theme="dark"] {
  --color-bg:     oklch(15% 0 0);
  --color-fg:     oklch(95% 0 0);
  --color-border: oklch(25% 0 0);
  --color-muted:  oklch(20% 0 0);
}
```

---

## Component API

Base class + modifier class pattern. All classes are plain CSS, no JS required.

### Button
```html
<button class="btn">Default</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
<button class="btn" disabled>Disabled</button>
```

### Badge
```html
<span class="badge">Default</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-sm">Small</span>
```

### Form Controls
```html
<input class="input" type="text" placeholder="Text" />
<select class="select"><option>Option</option></select>
<textarea class="textarea"></textarea>
<input class="checkbox" type="checkbox" />
<input class="radio" type="radio" />
<input class="toggle" type="checkbox" />
```

### Layout
```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>

<div class="container">...</div>
<hr class="divider" />
```

### CSS Layer structure
```css
@layer base { /* tokens, reset */ }
@layer components { /* .btn, .card, .input … */ }
```

Tailwind utilities live in `@layer utilities`, which has higher specificity than `@layer components`, so users can override any component style with Tailwind classes (e.g. `<button class="btn bg-red-500">`).

---

## Tailwind Integration

### Usage mode 1: CSS import (no Tailwind)
```js
import 'miksin-ui/dist/miksin-ui.css'
```

### Usage mode 2: Tailwind plugin
```js
// tailwind.config.js
plugins: [require('miksin-ui/tailwind')]
```

The plugin:
1. Injects the compiled CSS via `addBase()`
2. Extends Tailwind theme with semantic token mappings:
```js
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      bg:      'var(--color-bg)',
      fg:      'var(--color-fg)',
      border:  'var(--color-border)',
      muted:   'var(--color-muted)',
    },
    borderRadius: {
      base: 'var(--radius-base)',
    }
  }
}
```

---

## Build Pipeline

| Task | Tool |
|------|------|
| CSS compilation | PostCSS (autoprefixer + cssnano) |
| Package output | CSS file only, no JS bundler needed |
| Docs build | `astro build` → static HTML |
| npm publish | `pnpm publish` from `packages/miksin-ui` |
| Docs deploy | GitHub Pages |

### `packages/miksin-ui/package.json` exports
```json
{
  "name": "miksin-ui",
  "main": "./tailwind.js",
  "exports": {
    ".":                    "./tailwind.js",
    "./tailwind":           "./tailwind.js",
    "./dist/miksin-ui.css": "./dist/miksin-ui.css"
  }
}
```

Direct CSS usage (mode 1) requires an explicit path import:
```js
import 'miksin-ui/dist/miksin-ui.css'
```

---

## v1 Component Scope

In scope:
- Button (default, outline, ghost; sm/md/lg)
- Badge (default, outline; sm/md)
- Input, Select, Textarea
- Checkbox, Radio
- Toggle/Switch
- Card (with header/body/footer slots)
- Container, Divider

Out of scope for v1:
- Alert, Toast, Spinner
- Modal/Dialog
- Dropdown/Menu
- Navbar

---

## Documentation Site

Each component page contains:
1. Live demo (rendered HTML using the component classes)
2. Class reference table (all available modifier classes)
3. Copy-paste code examples

`tokens.astro` page documents all CSS variables with a visual reference table and theming guide.
