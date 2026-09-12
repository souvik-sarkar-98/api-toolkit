# Shared packages

NestJS libraries for API hosts. Most modules follow DDD layers (domain → application → infrastructure → presentation). The **host application** supplies Prisma adapters, IdP/HTTP edge wiring, and third-party credentials.

| Package | Role |
|---------|------|
| [`@api-toolkit/nestjs-shared-core`](nestjs-shared-core/README.md) | Aggregates, errors, envelopes, bootstrap, `CoreModule` |
| [`@api-toolkit/nestjs-shared-persistence`](nestjs-shared-persistence/README.md) | Prisma CRUD base, Redis cache, `DatabaseModule` |
| [`@api-toolkit/nestjs-shared-observability`](nestjs-shared-observability/README.md) | Technical-error alerts (`ObservabilityModule`) |
| [`@api-toolkit/nestjs-shared-health`](nestjs-shared-health/README.md) | Liveness / readiness / metrics probes |
| [`@api-toolkit/nestjs-shared-auth`](nestjs-shared-auth/README.md) | JWT/API-key/RBAC guards, `AuthFacade` |
| [`@api-toolkit/nestjs-shared-queue`](nestjs-shared-queue/README.md) | BullMQ jobs, `@QueueHandler`, `QueueFacade` |
| [`@api-toolkit/nestjs-shared-cron`](nestjs-shared-cron/README.md) | Scheduled jobs over a queue/store port |
| [`@api-toolkit/nestjs-shared-token-vault`](nestjs-shared-token-vault/README.md) | OAuth account/token vault, `TokenVaultFacade` |
| [`@api-toolkit/nestjs-shared-json-store`](nestjs-shared-json-store/README.md) | Versioned JSON documents, `JsonStoreFacade` |
| [`@api-toolkit/nestjs-shared-custom-forms`](nestjs-shared-custom-forms/README.md) | Form definitions and submissions, `CustomFormsFacade` |
| [`@api-toolkit/nestjs-shared-comment`](nestjs-shared-comment/README.md) | Entity comments and mentions |
| [`@api-toolkit/nestjs-shared-correspondence`](nestjs-shared-correspondence/README.md) | Email / in-app / push notifications |
| [`@api-toolkit/nestjs-shared-dms`](nestjs-shared-dms/README.md) | Document storage (Firebase or host `IStorageProvider`), `DmsFacade` |
| [`@api-toolkit/nestjs-shared-document-generator`](nestjs-shared-document-generator/README.md) | Excel / PDF generation |

Each package has its own `package.json` and builds to `dist/**`. Consumers install published versions from npm, or use workspace `"*"` ranges inside this monorepo.

```bash
npm run build   # turbo builds packages in dependency order (^build)
```

### Wiring rules (all feature packages)

- Import `XxxModule.forRoot()` / `forRootAsync()` once in the host.
- Implement repository **tokens** only in the host persistence module.
- Other bounded contexts use the package **facade** (or exported commands/queries on the bus). Do not inject foreign repositories.
- Reads of users from anywhere use `IUserLookupPort`. Writes to users belong in the host user module.

After changing a package, run `npm run changeset` from the repo root. Packages publish as public scoped packages to npmjs. See the root [README](../README.md#package-versioning-changesets).
