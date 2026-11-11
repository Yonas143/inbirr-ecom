# Contributing

Start with the [development guide](docs/development.md) and [architecture overview](docs/architecture.md).

Open an issue describing the change, then submit a focused pull request with behavior, validation and limitations. Run `pnpm test:unit`, `pnpm exec tsc --noEmit` and `pnpm build` against your own development database. MCP changes must include permission-denial tests; never use a live store for integration tests.

Preserve upstream notices and technical identifiers. Keep UI branding configurable. Do not add credentials, real orders, customer details, copyrighted store artwork, unsupported payment claims or a shared administrator password. New database fields require a migration and regenerated types/import maps. Keep setup reproducible with the committed lockfile.
