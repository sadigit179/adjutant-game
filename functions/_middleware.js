// Facebook and WhatsApp need the full address of the link picture, so it is filled in from whatever address the site has.
export async function onRequest({ request, next }) {
  const res = await next();
  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/html")) return res;
  const url = new URL(request.url);
  const origin = url.origin;
  return new HTMLRewriter()
    .on('meta[property="og:image"], meta[name="twitter:image"]', { element(e) { const v = e.getAttribute("content") || ""; if (v.startsWith("/")) e.setAttribute("content", origin + v); } })
    .on('meta[property="og:url"], link[rel="canonical"]', { element(e) { e.setAttribute(e.tagName === "link" ? "href" : "content", origin + "/"); } })
    .transform(res);
}
