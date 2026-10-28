// GET  /api/diary  -> { entries: [{n,c,txt,t}] }   everyone can read
// POST /api/diary  -> add one memory                everyone can write (no limit on how many)
import { db, json, COLLEGES } from "../../lib/server.js";

const clean = (s, max) => String(s ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);

export async function onRequestGet({ env }) {
  const d = await db(env);
  const { results } = await d.prepare("SELECT n, c, txt, t FROM diary WHERE hidden = 0 ORDER BY t DESC LIMIT 500").all();
  return json({ entries: results || [] });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
  const n = clean(body.n, 40) || "অজানা";
  const c = String(body.c || "");
  const txt = clean(body.txt, 1500);
  if (!txt || !COLLEGES.includes(c)) return json({ error: "invalid" }, 400);
  const d = await db(env);
  await d.prepare("INSERT INTO diary (n, c, txt, t) VALUES (?, ?, ?, ?)").bind(n, c, txt, Date.now()).run();
  return json({ ok: true });
}
