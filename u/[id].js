import {
  AVATAR_KEY,
  PROFILE_KEY,
  escapeHtml,
  normalizeId,
  renderLink
} from "../_lib/profile.js";

function pageShell(title, content, description = "") {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(title)}</title>
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ""}
<meta name="theme-color" content="#f8f9fa">
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    padding: 32px 16px 48px;
    background: #f8f9fa;
    color: #111827;
    font-family: "Segoe UI", Tahoma, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .wrap { width: 100%; max-width: 440px; }
  .card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 10px 30px rgba(0,0,0,.05);
    padding: 28px 22px;
    text-align: center;
  }
  .avatar {
    width: 92px;
    height: 92px;
    margin: 0 auto 16px;
    border-radius: 50%;
    object-fit: cover;
    background: #eff6ff;
    display: block;
  }
  .initial {
    width: 92px;
    height: 92px;
    margin: 0 auto 16px;
    border-radius: 50%;
    background: #2563eb;
    color: #fff;
    font-size: 38px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h1 { margin: 0 0 6px; font-size: 23px; line-height: 1.35; }
  .bio { margin: 0 0 22px; color: #6b7280; font-size: 14px; line-height: 1.7; white-space: pre-line; }
  .links { display: flex; flex-direction: column; gap: 10px; }
  .link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 13px;
    border-radius: 13px;
    background: #f3f4f6;
    color: #111827;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: transform .12s ease, background .12s ease;
    text-align: right;
  }
  .link:active { transform: scale(.985); }
  .link:hover { background: #e9ebef; }
  .badge {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 34px;
    letter-spacing: .2px;
  }
  .badge.dark { color: #111; }
  .footer { margin-top: 22px; color: #9ca3af; font-size: 12px; text-align: center; }
  .empty { color: #6b7280; font-size: 15px; line-height: 1.8; }
  .icon { width: 74px; height: 74px; margin: 0 auto 18px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 34px; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #f8fafc; }
    .card { background: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,.4); }
    .bio { color: #94a3b8; }
    .link { background: #334155; color: #f8fafc; }
    .link:hover { background: #3e4c63; }
    .footer { color: #64748b; }
  }
</style>
</head>
<body>
<div class="wrap">${content}</div>
</body>
</html>`;
}

function errorPage(status, title, message) {
  const content = `<div class="card">
    <div class="icon">🔍</div>
    <h1>${escapeHtml(title)}</h1>
    <p class="empty">${escapeHtml(message)}</p>
  </div>`;
  return new Response(pageShell(title, content), {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
  });
}

export async function onRequestGet({ params, request, env }) {
  const id = normalizeId(params.id);
  if (!id) return errorPage(404, "الصفحة غير موجودة", "تأكد من صحة الرابط الذي فتحته.");

  const record = await env.PROFILES.get(PROFILE_KEY(id), { type: "json" });
  if (!record) {
    return errorPage(404, "الصفحة غير موجودة", "تأكد من صحة الرابط أو اطلب من صاحب البطاقة مشاركته مرة أخرى.");
  }

  if (record.enabled === false) {
    return errorPage(403, "هذه الصفحة غير متاحة", "قام صاحب البطاقة بتعطيلها مؤقتاً.");
  }

  const origin = new URL(request.url).origin;
  const name = record.name || "بطاقة شخصية";
  const avatar = record.avatar
    ? record.avatar.startsWith("/")
      ? `${origin}${record.avatar}`
      : record.avatar
    : "";

  const avatarHtml = avatar
    ? `<img class="avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}">`
    : `<div class="initial">${escapeHtml(name.trim().charAt(0).toUpperCase() || "؟")}</div>`;

  const links = (record.links || [])
    .filter((link) => link.visible !== false)
    .map(renderLink)
    .filter(Boolean);

  const contact = record.contact || {};
  const contactLinks = [];
  if (contact.showPhone && contact.phone) {
    contactLinks.push({
      label: "اتصال هاتفي",
      target: `tel:${contact.phone}`,
      color: "#10B981",
      letter: "PH"
    });
  }
  if (contact.showEmail && contact.email) {
    contactLinks.push({
      label: "البريد الإلكتروني",
      target: `mailto:${contact.email}`,
      color: "#EA4335",
      letter: "@"
    });
  }

  const linkHtml = [...links, ...contactLinks]
    .map(
      (link) => `<a class="link" href="${escapeHtml(link.target)}" target="_blank" rel="noopener noreferrer">
        <span class="badge${link.dark ? " dark" : ""}" style="background:${escapeHtml(link.color)}">${escapeHtml(link.letter)}</span>
        <span>${escapeHtml(link.label)}</span>
      </a>`
    )
    .join("");

  const content = `<div class="card">
    ${avatarHtml}
    <h1>${escapeHtml(name)}</h1>
    ${record.bio ? `<p class="bio">${escapeHtml(record.bio)}</p>` : ""}
    ${linkHtml ? `<div class="links">${linkHtml}</div>` : `<p class="empty">لا توجد روابط منشورة بعد.</p>`}
  </div>
  <div class="footer">My Social QR</div>`;

  const description = record.bio || `روابط ${name} في مكان واحد`;
  return new Response(pageShell(name, content, description), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
      "access-control-allow-origin": "*"
    }
  });
}
