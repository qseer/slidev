import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

const rootDir = process.cwd()

function resolveEntry(argument) {
  if (!argument)
    return resolve(rootDir, 'slides.md')

  const normalized = argument.replace(/^--/, '').trim()
  if (!normalized)
    return resolve(rootDir, 'slides.md')

  return resolve(rootDir, 'slides', normalized, 'slides.md')
}

const target = process.argv[2]
const entry = resolveEntry(target)

if (!existsSync(entry)) {
  console.error(`Slide entry not found: ${entry}`)
  process.exit(1)
}

const child = spawn(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['exec', 'slidev', entry, '--open'],
  {
    stdio: 'inherit',
    cwd: rootDir,
  },
)

child.on('exit', code => {
  process.exit(code ?? 0)
})

