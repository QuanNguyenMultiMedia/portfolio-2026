// Read-only media server for the portfolio: GET/HEAD with byte ranges (video seeking), long immutable caching,
// and the edge cache in front so repeat views cost no R2 operation at all.
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));
    if (!key) return new Response(null, { status: 404 });

    const cache = caches.default;
    const ranged = request.headers.has("range");
    const cacheKey = new Request(url.origin + url.pathname, { method: "GET" });
    if (!ranged && request.method === "GET") {
      const hit = await cache.match(cacheKey);
      if (hit) return hit;
    }

    const obj = request.method === "HEAD"
      ? await env.MEDIA.head(key)
      : await env.MEDIA.get(key, { range: request.headers, onlyIf: request.headers });
    if (!obj) return new Response(null, { status: 404 });

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);
    headers.set("accept-ranges", "bytes");
    headers.set("access-control-allow-origin", "*");
    if (!headers.has("cache-control")) headers.set("cache-control", "public, max-age=31536000, immutable");

    if (request.method === "HEAD") { headers.set("content-length", String(obj.size)); return new Response(null, { headers }); }
    if (!("body" in obj)) return new Response(null, { status: 304, headers });

    if (obj.range && ranged) {
      const { offset = 0, length = obj.size - offset } = obj.range;
      headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${obj.size}`);
      headers.set("content-length", String(length));
      return new Response(obj.body, { status: 206, headers });
    }
    headers.set("content-length", String(obj.size));
    const res = new Response(obj.body, { headers });
    if (request.method === "GET") ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  },
};
