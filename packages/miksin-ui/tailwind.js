const plugin = require('tailwindcss/plugin')
const postcss = require('postcss')
const fs = require('fs')
const path = require('path')

const cssPath = path.join(__dirname, 'dist', 'miksin-ui.css')

module.exports = plugin(
  function ({ addBase, addComponents }) {
    const css = fs.readFileSync(cssPath, 'utf-8')
    const root = postcss.parse(css)
    root.each((node) => {
      if (node.type === 'atrule' && node.name === 'layer') {
        if (node.params === 'base') {
          addBase(node.nodes)
        } else if (node.params === 'components') {
          addComponents(node.nodes)
        }
      }
    })
  },
  {
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          bg: 'var(--color-bg)',
          fg: 'var(--color-fg)',
          border: 'var(--color-border)',
          muted: 'var(--color-muted)',
          'muted-fg': 'var(--color-muted-fg)',
        },
        borderRadius: {
          base: 'var(--radius-base)',
        },
      },
    },
  }
)
