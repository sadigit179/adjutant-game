// Developer-only. Every request must carry the secret ADMIN_KEY (set in Cloudflare, never written in the code).
// GET    /api/admin              -> every diary memory (with id and hidden flag) + visit total
// POST   /api/admin {id, hidden} -> hide or show one memory
// DELETE /api/admin {id}         -> delete one memory for good
import { db, json, isAdmin, visitTotal } from "../../lib/server.js";

async function list(d) {
  const { results } = await d.prepare("SELECT id, n, c, txt, t, hidden FROM diary ORDER BY t DESC LIMIT 2000").all();
  return (results || []).map(r => ({ ...r, hidden: !!r.hidden }));
}

export async function onRequest({ request, env }) {
  if (!isAdmin(request, env)) return json({ error: "not allowed" }, 401);
  const d = await db(env);
  if (request.method === "GET") return json({ entries: await list(d), visits: await visitTotal(d) });
  let body = {};
  try { body = await request.json(); } catch {}
  const id = Number(body.id);
  if (!Number.isInteger(id) || id < 1) return json({ error: "bad id" }, 400);
  if (request.method === "DELETE") await d.prepare("DELETE FROM diary WHERE id = ?").bind(id).run();
  else if (request.method === "POST") await d.prepare("UPDATE diary SET hidden = ? WHERE id = ?").bind(body.hidden ? 1 : 0, id).run();
  else return json({ error: "method" }, 405);
  return json({ ok: true, entries: await list(d) });
}
