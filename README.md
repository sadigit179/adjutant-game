# THE ADJUTANT — website (Cloudflare Pages)

- `public/` — what players get: the game (`index.html`), the developer page (`admin.html`), the link picture (`og-image.jpg`), icons
- `functions/` — the small server parts: College Diary, player count, developer tools
- `lib/server.js` — shared code for those parts
- `schema.sql` — the database tables (the site creates them by itself; kept for reference)

Cloudflare settings (one time):
- Build command: *(leave empty)* · Build output directory: `public`
- Bindings → D1 database → Variable name `DB` → database `adjutant-db`
- Variables and Secrets → `ADMIN_KEY` (type: Secret) = the developers' password

Developer page: `https://<your-site>/admin.html`
