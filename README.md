# API Toolkit

npm workspaces + [Turborepo](https://turbo.build/) of **shared NestJS libraries** for Nabarun APIs. This repository publishes `@api-toolkit/*` packages; applications live in separate repos (for example the backend monorepo) and consume these libraries from npm or a workspace link.

## Packages

| Area | Packages | Docs |
|------|----------|------|
| Foundation | `nestjs-shared-core`, `nestjs-shared-persistence` | [core](packages/nestjs-shared-core/README.md) · [persistence](packages/nestjs-shared-persistence/README.md) |
| Ops | `nestjs-shared-observability`, `nestjs-shared-health` | [observability](packages/nestjs-shared-observability/README.md) · [health](packages/nestjs-shared-health/README.md) |
| Identity & jobs | `nestjs-shared-auth`, `nestjs-shared-queue`, `nestjs-shared-cron`, `nestjs-shared-token-vault` | [auth](packages/nestjs-shared-auth/README.md) · [queue](packages/nestjs-shared-queue/README.md) · [cron](packages/nestjs-shared-cron/README.md) · [token-vault](packages/nestjs-shared-token-vault/README.md) |
| Content | `nestjs-shared-json-store`, `nestjs-shared-custom-forms`, `nestjs-shared-comment`, `nestjs-shared-correspondence`, `nestjs-shared-dms`, `nestjs-shared-document-generator` | [json-store](packages/nestjs-shared-json-store/README.md) · [custom-forms](packages/nestjs-shared-custom-forms/README.md) · [comment](packages/nestjs-shared-comment/README.md) · [correspondence](packages/nestjs-shared-correspondence/README.md) · [dms](packages/nestjs-shared-dms/README.md) · [document-generator](packages/nestjs-shared-document-generator/README.md) |

Catalog and wiring notes: [packages/README.md](packages/README.md).

**Convention:** host apps import each feature as `XxxModule.forRoot()` / `forRootAsync()`, implement persistence adapters in the host, and call **facades** (or the command/query bus) from other modules. Repository tokens are for host persistence wiring only.

## Prerequisites

- Node.js 22+
- npm 10+
- NestJS 11 (host app)

Install once at the repo root:

```bash
npm install
```

## Commands (from repo root)

| Script | Description |
|--------|-------------|
| `npm run build` | Build all workspace packages (dependency order via `^build`) |
| `npm run type-check` | Type-check all workspaces |
| `npm run test` | Run Jest from the repo root |
| `npm run clean` | Clean package `dist/` and Turbo cache |
| `npm run watch:packages` | Rebuild `packages/*` on change |
| `npm run changeset` | Record a semver bump + changelog entry |
| `npm run changeset:status` | Show pending changesets |
| `npm run version-packages` | Apply changesets (bump versions, changelogs) |
| `npm run release` | Type-check, build `packages/*`, and publish (npm dist-tag `latest`) |
| `npm run release:beta` | Type-check, build `packages/*`, and publish with npm dist-tag `beta` |

Target one package with `npm run <script> -w @api-toolkit/nestjs-shared-<name>`.

## Adding a shared package

Create `packages/nestjs-shared-<name>/package.json` (name `@api-toolkit/nestjs-shared-<name>`), then depend on it from another workspace with `"*"` or from an app via npm. Turborepo runs dependency builds first via `dependsOn: ["^build"]`. After a public API or behavior change, run `npm run changeset`.

## Package versioning (Changesets)

This repo uses [Changesets](https://github.com/changesets/changesets) to version and publish libraries under `packages/` independently (no fixed groups).

### Day-to-day workflow

1. **After changing a library**, add a changeset:

   ```bash
   npm run changeset
   ```

   Choose the affected package(s), a semver bump (`patch` / `minor` / `major`), and a short changelog summary.

2. **When ready to release**, on the main line with all changesets merged:

   ```bash
   npm run version-packages   # bumps package.json + CHANGELOG.md
   npm run release            # stable: type-check, build, publish (dist-tag latest)
   # on stage after `changeset pre enter beta`: npm run release:beta
   ```

   Commit the version/changelog updates (for example `chore: version packages`).

3. **Check pending releases** (needs a git repo with a `main` branch):

   ```bash
   npm run changeset:status
   ```

Dependent packages that use workspace `"*"` ranges get a patch bump when an upstream library changes (`updateInternalDependencies` in [`.changeset/config.json`](.changeset/config.json)). During publish, Changesets rewrites `"*"` to semver ranges in the published manifests.

### CI release pipeline

GitHub Actions uses the **deploy-platform** reusable workflows (this workspace’s `deploy-main` repo, GitHub `nabarun-ngo/deploy-platform`). The publish workflow versions with Changesets and publishes `@api-toolkit/*` to the public npm registry. It does **not** create git tags or GitHub Releases. Version history lives in `package.json`, `CHANGELOG.md`, and npm.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Pull requests to `main` or `stage` | Calls `reusable-ci-pr-check.yml` (install, type-check, lint if present, build, test) |
| [`.github/workflows/changeset-check.yml`](.github/workflows/changeset-check.yml) | Pull requests to `main` or `stage` | Calls `reusable-ci-changeset-check.yml`; fails if `packages/` changed without a changeset |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | Push to `main` or `stage` | Calls `reusable-ci-publish.yml` with `publish_to_npm: true`. Opens a **Version Packages** PR when changesets exist; publishes when that PR merges |

| Branch | npm dist-tag | Install |
|--------|----------------|---------|
| `main` | `latest` | `npm install @api-toolkit/nestjs-shared-core` |
| `stage` | `beta` | `npm install @api-toolkit/nestjs-shared-core@beta` |

**Setup (one-time):**

1. Add repository secret **`NPM_TOKEN`** with an npm automation token that can publish `@api-toolkit/*` packages.
2. Ensure you are logged in to npmjs with publish rights for `@api-toolkit` (`npm login`). Root [`.npmrc`](.npmrc) points the scope at `registry.npmjs.org`.
3. On the **`stage` branch only**, enter Changesets prerelease mode once and commit the result:

   ```bash
   npx changeset pre enter beta
   git add .changeset/pre.json
   git commit -m "chore: enter beta prerelease mode"
   ```

   Do not run that on `main`. To ship a stable line from `stage` later, run `npx changeset pre exit` on `stage` (or merge to `main` without `pre.json`).
4. Merge PRs with changesets as usual — the release workflow opens a follow-up PR that bumps versions and changelogs.
5. Merge the **Version Packages** PR — packages are built and published automatically (`latest` on `main`, `beta` on `stage`).

Local releases (`npm run release` / `npm run release:beta`) still work if you prefer manual control.

### Publishing notes

- Libraries under `packages/` publish as **public** packages to npmjs (`publishConfig.access: public` + `registry.npmjs.org`).
- Anyone can install without a token: `npm install @api-toolkit/nestjs-shared-core` (stable) or `npm install @api-toolkit/nestjs-shared-core@beta`.
- For CI publish, use an npm automation token (`NPM_TOKEN`) with write access to the `@api-toolkit` org.
- Workflows call `nabarun-ngo/deploy-platform` (`reusable-ci-publish.yml`, `reusable-ci-changeset-check.yml`, `reusable-ci-pr-check.yml`). That is the GitHub identity of this workspace’s `deploy-main` repo; change the `uses:` owner/name if the ops repo is published under a different path.
