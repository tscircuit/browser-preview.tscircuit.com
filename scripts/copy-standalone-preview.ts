// scripts/copy-standalone-preview.ts
import { copyFileSync } from 'fs'
import path from 'path'

const source = path.join(
  process.cwd(),
  'node_modules',
  '@tscircuit/runframe/dist/standalone-preview.min.js'
)
const dest = path.join(
  process.cwd(),
  'public',
  'standalone-preview.min.js'
)

copyFileSync(source, dest)