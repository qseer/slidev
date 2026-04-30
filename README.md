# Welcome to [Slidev](https://github.com/slidevjs/slidev)!

To start the slide show:

- `pnpm install`
- `pnpm run dev`
- visit <http://localhost:3030>

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

- Opening a PR to `main` triggers a build check.
- Merges pushed to `main` build and deploy automatically to GitHub Pages.
- The workflow publishes the generated `dist/` directory to GitHub Pages.
- The root `slides.md` is only used as the local default preview entry.
- Any `slides/<name>/slides.md` file is discovered automatically and deployed as `/<name>/`.
- Each deck is published to its own path, for example `/academic/` and `/demo/`.
- The `dist/index.html` homepage is generated automatically and links to every deployed deck.
- For project pages such as `https://<user>.github.io/<repo>/`, the workflow builds with the correct base path automatically.
- If you use a custom domain or want to override the path, set `SLIDEV_BASE_PATH` as a repository variable or secret, for example `/slides/`.

## Local Preview

- `pnpm dev` previews the root `slides.md` entry.
- `pnpm dev demo` previews `slides/demo/slides.md`.
- `pnpm dev --demo` is also supported and maps to the same `demo` deck.
