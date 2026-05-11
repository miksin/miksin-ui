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
