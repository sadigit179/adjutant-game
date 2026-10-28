// POST /api/visits -> count one visit and return the total; GET -> just the total.
import { db, json, visitTotal } from "../../lib/server.js";

export async function onRequestPost({ env }) {
  const d = await db(env);
  const r = await d.prepare("INSERT INTO counter (k, n) VALUES ('visits', 1) ON CONFLICT(k) DO UPDATE SET n = n + 1 RETURNING n").first();
  return json({ n: r ? r.n : 0 });
}

export async function onRequestGet({ env }) {
  return json({ n: await visitTotal(await db(env)) });
}
