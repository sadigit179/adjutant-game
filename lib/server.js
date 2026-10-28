// Shared helpers for the game's server parts (Cloudflare Pages Functions + a D1 database bound as DB).
export const COLLEGES = ["faujdarhat","jhenaidah","mirzapur","rajshahi","sylhet","rangpur","barisal","pabna","mymensingh","cumilla","feni","joypurhat"];

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

let ready = false;
// Creates the tables the first time the site is used, so nothing has to be typed into the Cloudflare console.
export async function db(env) {
  if (!env.DB) throw new Error("no database: bind a D1 database as DB");
  if (!ready) {
    await env.DB.batch([
      env.DB.prepare("CREATE TABLE IF NOT EXISTS diary (id INTEGER PRIMARY KEY AUTOINCREMENT, n TEXT NOT NULL, c TEXT NOT NULL, txt TEXT NOT NULL, t INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS diary_t ON diary (t DESC)"),
      env.DB.prepare("CREATE TABLE IF NOT EXISTS counter (k TEXT PRIMARY KEY, n INTEGER NOT NULL)")
    ]);
    ready = true;
  }
  return env.DB;
}

export function isAdmin(request, env) {
  const key = env.ADMIN_KEY;
  return !!key && key.length >= 8 && request.headers.get("x-admin-key") === key;
}

export async function visitTotal(d) {
  const r = await d.prepare("SELECT n FROM counter WHERE k = 'visits'").first();
  return r ? r.n : 0;
}
