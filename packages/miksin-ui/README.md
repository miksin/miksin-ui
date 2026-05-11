# miksin-ui

A personal CSS design system — pure component classes that work with any JS framework, with optional Tailwind v3 plugin.

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
  plugins: [miksinui],
}
```

### Without Tailwind

```html
<link rel="stylesheet" href="node_modules/miksin-ui/dist/miksin-ui.css" />
```

## Components

| Class | Element | Description |
|---|---|---|
| `.btn` | `<button>` | Base button |
| `.btn-primary` | `<button>` | Primary color variant |
| `.btn-ghost` | `<button>` | Ghost/outline variant |
| `.btn-sm` / `.btn-lg` | `<button>` | Size variants |
| `.badge` | `<span>` | Inline label |
| `.badge-primary` | `<span>` | Primary color badge |
| `.input` | `<input>` | Text input |
| `.select` | `<select>` | Select dropdown |
| `.textarea` | `<textarea>` | Multi-line input |
| `.checkbox` | `<input type="checkbox">` | Styled checkbox |
| `.radio` | `<input type="radio">` | Styled radio button |
| `.toggle` | `<input type="checkbox">` | On/off switch |
| `.card` | `<div>` | Card container |
| `.card-body` | `<div>` | Card content area |
| `.container` | `<div>` | Centered page container |
| `.divider` | `<hr>` | Horizontal rule |

## Theming

Override CSS variables to customize the design system:

```css
:root {
  --color-primary: oklch(55% 0.2 250);
  --color-bg: oklch(98% 0 0);
  --color-fg: oklch(15% 0 0);
  --radius-base: 0.375rem;
}
```

Dark mode via `data-theme="dark"` on any ancestor element.

## License

MIT
