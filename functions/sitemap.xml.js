import { PROFILE_KEY, normalizeId } from "./_lib/profile.js";

const PREFIX = PROFILE_KEY("");
const MAX_URLS = 50000;

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, lastmod, changefreq, priority) {
  const lines = ["  <url>", `    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  lines.push("  </url>");
  return lines.join("\n");
}

export async function onRequestGet({ request, env }) {
  const origin = new URL(request.url).origin;
  const entries = [urlEntry(`${origin}/`, "", "weekly", "1.0")];

  try {
    let cursor;
    let complete = false;

    while (!complete && entries.length < MAX_URLS) {
      const page = await env.PROFILES.list({
        prefix: PREFIX,
        limit: 1000,
        ...(cursor ? { cursor } : {})
      });

      for (const key of page.keys || []) {
        if (entries.length >= MAX_URLS) break;
        const id = normalizeId(String(key.name || "").slice(PREFIX.length));
        if (!id) continue;
        if (key.metadata && key.metadata.enabled === false) continue;

        const updatedAt = Number(key.metadata?.updatedAt);
        const lastmod = Number.isFinite(updatedAt) && updatedAt > 0 && updatedAt < 8640000000000000
          ? new Date(updatedAt).toISOString()
          : "";
        entries.push(urlEntry(`${origin}/u/${id}`, lastmod, "weekly", "0.8"));
      }

      complete = page.list_complete === true;
      cursor = page.cursor;
      if (!cursor) break;
    }
  } catch {
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*"
    }
  });
}
