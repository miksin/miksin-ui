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

test('button classes present', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('.btn'), '.btn missing')
  assert.ok(css.includes('.btn-outline'), '.btn-outline missing')
  assert.ok(css.includes('.btn-ghost'), '.btn-ghost missing')
  assert.ok(css.includes('.btn-sm'), '.btn-sm missing')
  assert.ok(css.includes('.btn-lg'), '.btn-lg missing')
})

test('badge classes present', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('.badge'), '.badge missing')
  assert.ok(css.includes('.badge-outline'), '.badge-outline missing')
  assert.ok(css.includes('.badge-sm'), '.badge-sm missing')
})

test('form control classes present', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('.input'), '.input missing')
  assert.ok(css.includes('.select'), '.select missing')
  assert.ok(css.includes('.textarea'), '.textarea missing')
})

test('checkbox/radio/toggle classes present', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('.checkbox'), '.checkbox missing')
  assert.ok(css.includes('.radio'), '.radio missing')
  assert.ok(css.includes('.toggle'), '.toggle missing')
})

test('layout classes present', () => {
  const css = readFileSync(distPath, 'utf-8')
  assert.ok(css.includes('.card'), '.card missing')
  assert.ok(css.includes('.card-header'), '.card-header missing')
  assert.ok(css.includes('.card-body'), '.card-body missing')
  assert.ok(css.includes('.card-footer'), '.card-footer missing')
  assert.ok(css.includes('.container'), '.container missing')
  assert.ok(css.includes('.divider'), '.divider missing')
})
