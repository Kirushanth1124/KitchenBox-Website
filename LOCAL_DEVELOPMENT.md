# Local development and hosting requirements

This is the exact published application source, plus this delivery guide. It is not a standalone production server with preconfigured login/database accounts.

## Requirements
- Node.js >=22.13.0 (see package.json).
- pnpm matching package.json packageManager, or Corepack capable of installing that pnpm release.
- Internet access to install dependencies.
- Cloudflare Workers/D1 runtime; application SQL is SQLite/D1, not Postgres/MySQL.

From the extracted folder, install with `pnpm install --frozen-lockfile`. Then `pnpm run build` generates `dist/server/wrangler.json`.

Apply the local SQL migrations once, in order, using the generated configuration:

```text
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_previous_giant_man.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_parallel_penance.sql
```

Do not replay applied migrations. These commands create schema only; they do not create business data or an administrator.

`pnpm run dev` uses portable Vinext development at the printed local address (normally http://localhost:5173). `pnpm run start` runs the built Worker locally, without the portable sign-in simulation.

## Important authentication limit
The starter’s loopback-only development sign-in simulates the identity `local_seedy` / `seedy@sites.test`. This is a development facility, NOT a default production admin or password. A fresh local database has no staff membership, so the operations dashboard denies that identity until a developer explicitly provisions a matching local staff record. Production membership is never granted by this simulation. Do not publish or forward local preview headers/cookies as real identity.

The current live project authenticates through the Sites platform. Existing owner membership is in that hosted database and is not exported. Staff need both Site access and an administrator-assigned staff email/role. A fully independent hosting setup needs a real authentication provider/session implementation; it is not supplied in this source release.

## WhatsApp adapter
`.dev.vars.example` documents the bridge variable name only. Configure a real secret on the server, never in browser/mobile code. External integration additionally needs the agreed authenticated gateway/access arrangement because the hosted Site is private. The outbox is queued data, not an active WhatsApp sender. No live credentials or payment gateways are bundled.

## Checks
`node tests/operations.mjs`
`pnpm exec tsc --noEmit`

Business checks and build were completed in the managed Linux runtime. Installation and browser behavior on your Windows machine have not been verified. See README.md for operating limits and remaining launch checks.
