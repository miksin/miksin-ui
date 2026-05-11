import { test } from 'node:test'
import assert from 'node:assert'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = join(__dirname, '../dist/miksin-ui.css')

test('dist file exists', () => {
  assert.ok(existsSync(distPath), 'dist/miksin-ui.css not found — run pnpm build first')
})

test('CSS variables defined', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('--color-primary'), '--color-primary missing')
  assert.ok(css.includes('--color-bg'), '--color-bg missing')
  assert.ok(css.includes('--color-fg'), '--color-fg missing')
  assert.ok(css.includes('--color-border'), '--color-border missing')
  assert.ok(css.includes('--radius-base'), '--radius-base missing')
})
