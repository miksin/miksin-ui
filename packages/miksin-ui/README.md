# miksin-ui

A personal token-based CSS design system — pure component classes that work with any JS framework, with an optional Tailwind v3 plugin.

## Install

```bash
npm install miksin-ui
```

## Usage

### With Tailwind v3

```js
// tailwind.config.js
import miksinui from 'miksin-ui/tailwind'

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,astro,vue,svelte}'],
  plugins: [miksinui],
}
```

### Without Tailwind

```js
import 'miksin-ui/dist/miksin-ui.css'
```

## Components

| Class | Element | Notes |
|---|---|---|
| `.btn` | `<button>` | Default (primary fill) |
| `.btn-outline` | `<button>` | Outlined variant |
| `.btn-ghost` | `<button>` | No border or background |
| `.btn-sm` / `.btn-lg` | `<button>` | Size variants |
| `.badge` | `<span>` | Inline label |
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

Override CSS variables to customize the design system:

```css
:root {
  --color-primary-500:   oklch(58% 0.22 145); /* green */
  --color-secondary-500: oklch(65% 0.18 260); /* blue */
  --radius-base:         0.5rem;
}
```

Dark mode via `data-theme="dark"` on any ancestor element.

## License

MIT
