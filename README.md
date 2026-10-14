# KitchenBox — website operations v1.1

Responsive public brand/menu website plus admin, vendor, collecting-point and rider workspaces, backed by Cloudflare D1. Customer ordering stays in WhatsApp with the separate customer team. Website manual intake and the protected bridge use the same business rules.

## Run locally on Windows
1. Install Node >=22.13.0 and pnpm matching package.json.
2. Extract this project; open its folder in VS Code.
3. `pnpm install --frozen-lockfile`
4. `pnpm run build`
5. Run `setup-local.bat` (or `node scripts/setup-local.mjs`). It checks local tables, applies only missing schema versions and generates a random owner setup key in ignored .dev.vars. Existing local business data is preserved.
6. Run `start.bat` (or `pnpm run dev`). Open the printed URL, normally http://localhost:5173.
7. Team workspace -> create your first administrator using the setup key, YOUR email/name and YOUR password. No default password, demo staff, meals or orders are supplied.
8. Settings -> Vendors -> Menu -> Kitchen supply -> Customers -> Team. Add actual information.
9. In Team, create an account activation link for each staff member; deliver it privately. The link expires after 24 hours, is single-use and can create/reset the account. Staff sign in with their own email/password.

Local data uses .wrangler/state. Keep a backup when moving/updating the project. Do not delete that directory or re-run old migration files blindly. Windows installation/build of the previous release was user-confirmed; this release's business/authentication checks, build and setup helper are validated on Linux. Visual browser/mobile testing remains pending.

## Authentication and permissions
Application email/password login works without simulated ChatGPT identities after the owner account is created. Passwords use bcrypt cost 12 with explicit 12-character minimum/72-byte maximum; session tokens are random and stored hashed, HttpOnly/SameSite cookies expire after seven days, HTTPS cookies are Secure. Password changes invalidate previous sessions. Failed attempts are persisted with throttling. Disabled staff access is checked on every authenticated operation. No registration can grant itself a role: roles belong to administrator-created staff records. There is no automatic email delivery or self-service email recovery; admins issue new activation links. Account email is immutable in normal staff edit.

Existing hosted owners can migrate through native authenticated owner verification before the first real account is created. That fallback is unavailable once an account exists. Sites private access remains an additional hosting layer; independent app login does not make the current owner-private Site public. A standalone Cloudflare deployment needs a real D1 binding and first-owner bootstrap secret.

## Business rules
Same-day lunch only. New orders/changes before 09:20, cancellation before 09:30 Asia/Colombo. Normal COD, configurable bulk advance, explicit customer-level bulk COD exemption and optional value limit. Individual customers, not company purchasing/billing. No discounts. One delivery fee per order. Common menu hides vendor identities; internal allocations retain traceability. Dated vendor quantities are reserved atomically. Complete multi-vendor orders can be packed only from actual received food. Rider capacity includes outstanding assigned work. Reassignment checks capacity and physical handover. Delivery, actual cash collection and reconciliation are separate.

Business records have no seeded sample data. Legacy evaluation tables are retained without display. Operational mutations read an atomic D1 snapshot and use a unique revision guard in a transaction; stale writes roll back. Account/password data uses separate tables and is not returned to dashboards.

## UI
Light/dark/system theme; preference is stored only on the device. Short hover/press elevation, page/modal/toast transitions, loading indicators, subtle status pulse and scroll reveal. Reduced-motion preference disables animation. Designs use supplied KitchenBox branding/assets, no invented testimonials or counts.

## Checks
`node tests/operations.mjs` — 32 business scenarios.
`node tests/auth.mjs` — 17 auth-route checks with a real temporary SQLite schema and actual password hashing. Requires a Node version supporting node:sqlite; it is used for tests, not the application database.
`pnpm exec tsc --noEmit`
`pnpm run build`
Drizzle migrations are append-only; 0002 adds real account/session/invitation tables.

## WhatsApp handoff / launch limits
See public/integration-guide.txt. Configure KITCHENBOX_BRIDGE_TOKEN as a server secret, never client/mobile code. The current Site is private: the other team needs the agreed authenticated relay/access arrangement. Notification queue is not an active sender; no Meta credentials, lease/retry worker, NLP feedback classifier or live WhatsApp delivery is bundled. Admin verifies bank advances/refunds manually; no card/online checkout, map optimisation or GPS stream is supplied. Split delivery/extra-trip planning are manual service remedies, not an implemented partial-item dispatch flow. Records should be paginated/archived before large-volume operation. Hosting plan capacity, production security review, browser/device QA and real adapter end-to-end tests remain required before broad live launch.
