import { spawnSync } from 'node:child_process'

function normalizeBasePath(input) {
  if (!input || input === '/')
    return '/'

  const trimmed = input.trim().replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
}

function resolveBasePath() {
  const explicit = process.env.SLIDEV_BASE_PATH || process.env.BASE_PATH
  if (explicit)
    return normalizeBasePath(explicit)

  const repository = process.env.GITHUB_REPOSITORY
  if (!repository)
    return '/'

  const repoName = repository.split('/')[1]
  if (!repoName || repoName.endsWith('.github.io'))
    return '/'

  return `/${repoName}/`
}

const base = resolveBasePath()
const result = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['exec', 'slidev', 'build', '--base', base],
  {
    stdio: 'inherit',
    env: process.env,
  },
)

if (result.error)
  throw result.error

process.exit(result.status ?? 1)
