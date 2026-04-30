import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { slides } from './slides.config.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function normalizeBasePath(input) {
  if (!input || input === '/')
    return '/'

  const trimmed = input.trim().replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
}

function resolveSiteBasePath() {
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

function runCommand(args) {
  const result = spawnSync(
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    args,
    {
      stdio: 'inherit',
      cwd: rootDir,
      env: process.env,
    },
  )

  if (result.error)
    throw result.error
  if (result.status !== 0)
    process.exit(result.status ?? 1)
}

function buildDeck(siteBase, slide) {
  const entry = resolve(rootDir, slide.entry)
  const output = resolve(rootDir, 'dist', slide.slug)
  const base = normalizeBasePath(`${siteBase}${slide.slug}`)

  mkdirSync(output, { recursive: true })
  runCommand(['exec', 'slidev', 'build', entry, '--base', base, '--out', output])
}

function renderIndex(siteBase) {
  const links = slides.map(slide => `      <li><a href="./${slide.slug}/">${slide.title}</a><span>${slide.description}</span></li>`).join('\n')

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Slidev Decks</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f2ea;
      --card: rgba(255, 255, 255, 0.82);
      --text: #182028;
      --muted: #5c6570;
      --line: rgba(24, 32, 40, 0.12);
      --accent: #0f766e;
      --accent-strong: #115e59;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Avenir Next", "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 28rem),
        radial-gradient(circle at bottom right, rgba(180, 83, 9, 0.14), transparent 26rem),
        linear-gradient(160deg, #f8f5ee 0%, #efe7d7 100%);
      display: grid;
      place-items: center;
      padding: 32px;
    }
    main {
      width: min(760px, 100%);
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 32px;
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 60px rgba(24, 32, 40, 0.12);
    }
    h1 {
      margin: 0 0 8px;
      font-size: clamp(2rem, 5vw, 3.4rem);
      line-height: 1;
      letter-spacing: -0.04em;
    }
    p {
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 1.05rem;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 14px;
    }
    li {
      display: grid;
      gap: 6px;
      padding: 18px 20px;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.72);
    }
    a {
      color: var(--accent-strong);
      text-decoration: none;
      font-weight: 700;
      font-size: 1.05rem;
    }
    a:hover { color: var(--accent); }
    span {
      color: var(--muted);
      font-size: 0.96rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Slidev Decks</h1>
    <p>这个仓库当前已部署以下演示文稿。新增 slide 后，只需要在构建清单中注册即可自动发布。</p>
    <ul>
${links}
    </ul>
  </main>
</body>
</html>
`
}

const siteBase = resolveSiteBasePath()
const distDir = resolve(rootDir, 'dist')

rmSync(distDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })

for (const slide of slides)
  buildDeck(siteBase, slide)

writeFileSync(resolve(distDir, 'index.html'), renderIndex(siteBase))
