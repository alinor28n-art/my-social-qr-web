import {
  escapeHtml,
  normalizeId,
  PROFILE_KEY,
  renderLink
} from "../_lib/profile.js";

const ICONS = {
  instagram:
    '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227a3.7 3.7 0 0 1-.896 1.382c-.42.419-.82.679-1.382.896-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413a3.7 3.7 0 0 1-1.382-.896 3.7 3.7 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.382.42-.419.82-.679 1.382-.896.422-.164 1.057-.36 2.227-.413C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.15 0-3.523.012-4.767.069-1.15.052-1.774.245-2.19.407-.55.214-.943.47-1.356.883-.413.413-.669.806-.883 1.356-.162.416-.355 1.04-.407 2.19-.057 1.244-.069 1.617-.069 4.767s.012 3.523.069 4.767c.052 1.15.245 1.774.407 2.19.214.55.47.943.883 1.356.413.413.806.669 1.356.883.416.162 1.04.355 2.19.407 1.244.057 1.617.069 4.767.069s3.523-.012 4.767-.069c1.15-.052 1.774-.245 2.19-.407.55-.214.943-.47 1.356-.883.413-.413.669-.806.883-1.356.162-.416.355-1.04.407-2.19.057-1.244.069-1.617.069-4.767s-.012-3.523-.069-4.767c-.052-1.15-.245-1.774-.407-2.19a3.65 3.65 0 0 0-.883-1.356 3.65 3.65 0 0 0-1.356-.883c-.416-.162-1.04-.355-2.19-.407-1.244-.057-1.617-.069-4.767-.069zm0 3.064a4.971 4.971 0 1 1 0 9.942 4.971 4.971 0 0 1 0-9.942zm0 8.197a3.226 3.226 0 1 0 0-6.452 3.226 3.226 0 0 0 0 6.452zm6.406-8.401a1.161 1.161 0 1 1-2.322 0 1.161 1.161 0 0 1 2.322 0z"/>',
  facebook:
    '<path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
  twitter:
    '<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.291 19.491h2.039L6.486 3.24H4.298L17.61 20.644z"/>',
  youtube:
    '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  whatsapp:
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>',
  telegram:
    '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>',
  linkedin:
    '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  github:
    '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>',
  snapchat:
    '<path d="M12 2c-2.8 0-4.5 2-4.5 4.7 0 1 .1 1.9.1 2.7-.5-.1-1-.3-1.4-.3-.6 0-1 .4-1 .9 0 .7.7 1 1.4 1.3.6.2.8.4.9.7.2.5-.5 1.7-1.4 2.6-.9.9-1.9 1.3-2.8 1.5-.4.1-.6.3-.6.6 0 .5.7.9 1.6 1.1.3.1.5.1.6.4.1.4.1 1 .7 1 .4 0 .8-.2 1.4-.2.5 0 .9.1 1.4.4.7.4 1.4.9 2.6.9s1.9-.5 2.6-.9c.5-.3.9-.4 1.4-.4.6 0 1 .2 1.4.2.6 0 .6-.6.7-1 .1-.3.3-.3.6-.4.9-.2 1.6-.6 1.6-1.1 0-.3-.2-.5-.6-.6-.9-.2-1.9-.6-2.8-1.5-.9-.9-1.6-2.1-1.4-2.6.1-.3.3-.5.9-.7.7-.3 1.4-.6 1.4-1.3 0-.5-.4-.9-1-.9-.4 0-.9.2-1.4.3 0-.8.1-1.7.1-2.7C16.5 4 14.8 2 12 2z"/>',
  tiktok:
    '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  threads:
    '<path d="M12.3 2.2c-5.4 0-9.3 4-9.3 9.8s3.9 9.8 9.3 9.8c3.9 0 6.8-1.8 7.9-4.9.8-2.3.1-4.8-1.8-6.2-1.7-1.2-4.2-1.6-6.6-1-2.2.5-3.8 1.9-3.8 3.7 0 1.8 1.6 3.2 3.8 3.2 1.8 0 3.2-1 3.2-2.6 0-1.2-.9-2-2.2-2.2-1.1-.1-2.1.3-2.5 1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  discord:
    '<path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.011c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.247.198.373.292a.077.077 0 0 1-.007.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.04.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029zM8.02 15.331c-1.182 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z"/>',
  pinterest:
    '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>',
  website:
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.4 2.5 3.7 5.5 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-5.5-3.7-9S9.6 5.5 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  email:
    '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.4-8 5.1-8-5.1V6.2l8 5.1 8-5.1v2.2z"/>',
  phone:
    '<path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.66-.36 1.01-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.85 21 3 13.15 3 3.63c0-.55.45-1 1-1H7.5c.55 0 1 .45 1 1 0 1.26.2 2.46.57 3.58.11.35.03.74-.25 1.01l-2.2 2.2z"/>',
  custom:
    '<path d="M10.6 13.4a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.31 1.31 1.41 1.42 1.32-1.32a2 2 0 0 1 2.83 2.83l-3 3a2 2 0 0 1-2.83 0l-1.42 1.42zm2.8-2.8a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.31-1.31-1.41-1.42-1.32 1.32a2 2 0 0 1-2.83-2.83l3-3a2 2 0 0 1 2.83 0l1.42-1.42z"/>',
  search:
    '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16.2 16.2 4.3 4.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
};

function iconSvg(platform) {
  const body = ICONS[platform] || ICONS.custom;
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
}

function linkSubtitle(link) {
  if (link.platform === "phone") return String(link.target || "").replace(/^tel:/, "");
  if (link.platform === "email") return String(link.target || "").replace(/^mailto:/, "");
  try {
    const url = new URL(link.target);
    const host = url.hostname.replace(/^www\./, "");
    const path = decodeURIComponent(url.pathname.replace(/^\/+/, "")).replace(/\/$/, "");
    return path ? `${host}/${path}` : host;
  } catch (e) {
    return "";
  }
}

function clampText(value, max) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  let cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.6) cut = cut.slice(0, lastSpace);
  return `${cut.replace(/[،,.;:\-]+$/, "")}…`;
}

function jsonLdScript(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function pageShell(title, content, options = {}) {
  const description = options.description || "";
  const image = options.image || "";
  const url = options.url || "";
  const robots = options.robots || "index, follow, max-image-preview:large, max-snippet:-1";
  const jsonLd = options.jsonLd || "";
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(title)}</title>
${description ? `<meta name="description" content="${escapeHtml(description)}">` : ""}
<meta name="robots" content="${escapeHtml(robots)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#eef2f7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b1220" media="(prefers-color-scheme: dark)">
<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
${url ? `<link rel="canonical" href="${escapeHtml(url)}">` : ""}
<meta property="og:type" content="profile">
<meta property="og:site_name" content="My Social QR">
<meta property="og:locale" content="ar_SA">
<meta property="og:title" content="${escapeHtml(title)}">
${description ? `<meta property="og:description" content="${escapeHtml(description)}">` : ""}
${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ""}
${image ? `<meta property="og:image:alt" content="${escapeHtml(title)}">` : ""}
${url ? `<meta property="og:url" content="${escapeHtml(url)}">` : ""}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${escapeHtml(title)}">
${description ? `<meta name="twitter:description" content="${escapeHtml(description)}">` : ""}
${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ""}
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
<style>
  :root {
    color-scheme: light;
    --bg: #eef2f7;
    --card: #ffffff;
    --text: #0f172a;
    --muted: #64748b;
    --line: #e8edf4;
    --row: #f7f9fc;
    --row-hover: #eef3fa;
    --shadow: 0 26px 70px -24px rgba(15,23,42,.38), 0 4px 14px rgba(15,23,42,.06);
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; }
  body {
    min-height: 100vh;
    padding: max(24px, env(safe-area-inset-top)) 16px max(36px, env(safe-area-inset-bottom));
    background:
      radial-gradient(760px 420px at 50% -12%, #dbeafe 0%, transparent 62%),
      radial-gradient(620px 380px at 110% 110%, #ede9fe 0%, transparent 60%),
      var(--bg);
    color: var(--text);
    font-family: "Segoe UI", "Noto Sans Arabic", "Noto Kufi Arabic", Tahoma, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    line-height: 1.5;
  }
  .wrap { width: 100%; max-width: 452px; margin: auto 0; }
  .card {
    position: relative;
    background: var(--card);
    border: 1px solid rgba(255,255,255,.7);
    border-radius: 30px;
    overflow: hidden;
    box-shadow: var(--shadow);
    animation: cardIn .55s cubic-bezier(.2,.8,.2,1) both;
  }
  .cover {
    position: relative;
    height: 152px;
    overflow: hidden;
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 48%, #7c3aed 100%);
  }
  .cover::before {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    top: -190px;
    left: -70px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,.42) 0%, rgba(255,255,255,0) 68%);
  }
  .cover::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,.22) 1px, transparent 1.2px);
    background-size: 18px 18px;
    opacity: .55;
    mask-image: linear-gradient(180deg, #000 0%, transparent 85%);
  }
  .cover-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .cover-img.is-blur {
    filter: blur(22px) saturate(1.25);
    transform: scale(1.18);
    opacity: .9;
  }
  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15,23,42,.12) 0%, rgba(15,23,42,.55) 100%);
  }
  .body { padding: 0 22px 24px; }
  .avatar-wrap {
    position: relative;
    z-index: 2;
    width: 116px;
    height: 116px;
    margin: -60px auto 14px;
    border-radius: 50%;
    padding: 4px;
    background: var(--card);
    box-shadow: 0 18px 36px -14px rgba(15,23,42,.55);
  }
  .avatar-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }
  .avatar { width: 100%; height: 100%; object-fit: cover; display: block; }
  .initial {
    color: #fff;
    font-size: 44px;
    font-weight: 800;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(0,0,0,.18);
  }
  h1 {
    margin: 0 0 7px;
    font-size: 25px;
    line-height: 1.35;
    font-weight: 800;
    letter-spacing: -.2px;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .bio {
    margin: 0 auto 22px;
    max-width: 348px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.85;
    text-align: center;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 2px 10px;
    color: var(--muted);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: .3px;
  }
  .section-head .count {
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 999px;
    background: var(--row);
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }
  .links { display: flex; flex-direction: column; gap: 10px; }
  .link {
    --brand: #2563eb;
    position: relative;
    display: flex;
    align-items: center;
    gap: 13px;
    min-height: 62px;
    padding: 10px 12px;
    border-radius: 17px;
    background: var(--row);
    border: 1px solid var(--line);
    color: var(--text);
    text-decoration: none;
    transition: transform .16s ease, background .16s ease, border-color .16s ease, box-shadow .16s ease;
    animation: rowIn .5s cubic-bezier(.2,.8,.2,1) both;
    animation-delay: calc(.055s * var(--i, 0) + .12s);
  }
  .link:hover {
    background: var(--row-hover);
    border-color: rgba(37,99,235,.18);
    transform: translateY(-1px);
    box-shadow: 0 12px 26px -18px rgba(15,23,42,.55);
  }
  .link:active { transform: scale(.99); }
  .tile {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    background: var(--brand);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 8px 16px -10px var(--brand);
  }
  .tile.dark { color: #0b1220; }
  .tile svg { width: 22px; height: 22px; }
  .link-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .link-label {
    font-size: 14.5px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .link-sub {
    color: var(--muted);
    font-size: 11.5px;
    font-weight: 500;
    direction: ltr;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .go {
    flex: 0 0 24px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    opacity: .55;
  }
  .go svg { width: 18px; height: 18px; }
  .empty {
    margin: 0;
    padding: 22px 16px;
    border-radius: 16px;
    border: 1px dashed var(--line);
    color: var(--muted);
    font-size: 14px;
    line-height: 1.8;
    text-align: center;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 18px;
    color: var(--muted);
    font-size: 11.5px;
    text-decoration: none;
  }
  .footer .dot {
    width: 8px;
    height: 8px;
    border-radius: 3px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    box-shadow: 0 4px 10px -2px rgba(37,99,235,.6);
  }
  .footer strong { color: var(--text); font-weight: 700; }
  .state-card {
    background: var(--card);
    border-radius: 26px;
    box-shadow: var(--shadow);
    padding: 40px 26px;
    text-align: center;
    animation: cardIn .55s cubic-bezier(.2,.8,.2,1) both;
  }
  .state-icon {
    width: 76px;
    height: 76px;
    margin: 0 auto 18px;
    border-radius: 22px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    box-shadow: 0 16px 30px -14px rgba(37,99,235,.7);
  }
  .state-card h1 { font-size: 21px; }
  .state-card .empty { margin-top: 14px; }
  .state-icon svg { width: 34px; height: 34px; }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(14px) scale(.99); }
    to { opacity: 1; transform: none; }
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
      --bg: #0b1220;
      --card: #131c2e;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --line: #223048;
      --row: #1a2438;
      --row-hover: #202d45;
      --shadow: 0 28px 80px -24px rgba(0,0,0,.75), 0 2px 10px rgba(0,0,0,.3);
    }
    body {
      background:
        radial-gradient(760px 420px at 50% -12%, rgba(37,99,235,.28) 0%, transparent 62%),
        radial-gradient(620px 380px at 110% 110%, rgba(124,58,237,.22) 0%, transparent 60%),
        var(--bg);
    }
    .card, .state-card { border-color: rgba(255,255,255,.06); }
    .avatar-wrap { box-shadow: 0 18px 36px -14px rgba(0,0,0,.8); }
  }
  @media (prefers-reduced-motion: reduce) {
    .card, .state-card, .link { animation: none; }
    .link, .link:hover, .link:active { transition: none; transform: none; }
  }
</style>
</head>
<body>
<div class="wrap">${content}</div>
</body>
</html>`;
}

function errorPage(status, title, message) {
  const content = `<div class="state-card">
    <div class="state-icon">${iconSvg("search")}</div>
    <h1>${escapeHtml(title)}</h1>
    <p class="empty">${escapeHtml(message)}</p>
  </div>`;
  return new Response(pageShell(title, content, { robots: "noindex, nofollow" }), {
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
  const name = (record.name || "").trim() || "بطاقة شخصية";
  const initial = name.trim().charAt(0).toUpperCase() || "؟";

  const resolveUrl = (value) => {
    const raw = String(value || "");
    if (!raw) return "";
    if (raw.startsWith("/")) return `${origin}${raw}`;
    return /^https?:\/\//i.test(raw) ? raw : "";
  };

  const avatar = resolveUrl(record.avatar);
  const cover = resolveUrl(record.cover);
  const coverImage = cover || avatar;
  const coverClass = cover ? "" : " is-blur";

  const avatarHtml = `<div class="avatar-wrap">
    <div class="avatar-inner">
      <span class="initial">${escapeHtml(initial)}</span>
      ${avatar ? `<img class="avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" loading="eager" onerror="this.remove()">` : ""}
    </div>
  </div>`;

  const links = (record.links || [])
    .filter((link) => link.visible !== false)
    .map(renderLink)
    .filter(Boolean);

  const contact = record.contact || {};
  const contactLinks = [];
  if (contact.showPhone && contact.phone) {
    contactLinks.push({
      platform: "phone",
      label: "اتصال هاتفي",
      target: `tel:${contact.phone}`,
      color: "#10B981",
      letter: "PH"
    });
  }
  if (contact.showEmail && contact.email) {
    contactLinks.push({
      platform: "email",
      label: "البريد الإلكتروني",
      target: `mailto:${contact.email}`,
      color: "#EA4335",
      letter: "@"
    });
  }

  const allLinks = [...links, ...contactLinks];
  const linkHtml = allLinks
    .map((link, index) => {
      const subtitle = linkSubtitle(link);
      return `<a class="link" href="${escapeHtml(link.target)}" target="_blank" rel="noopener noreferrer" style="--brand:${escapeHtml(link.color)};--i:${index}">
        <span class="tile${link.dark ? " dark" : ""}">${iconSvg(link.platform)}</span>
        <span class="link-text">
          <span class="link-label">${escapeHtml(link.label)}</span>
          ${subtitle ? `<span class="link-sub">${escapeHtml(subtitle)}</span>` : ""}
        </span>
        <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7"/></svg></span>
      </a>`;
    })
    .join("");

  const content = `<main class="card">
    <div class="cover">
      ${coverImage ? `<img class="cover-img${coverClass}" src="${escapeHtml(coverImage)}" alt="" aria-hidden="true" onerror="this.remove()">` : ""}
      <div class="cover-overlay"></div>
    </div>
    <div class="body">
      ${avatarHtml}
      <h1>${escapeHtml(name)}</h1>
      ${record.bio ? `<p class="bio">${escapeHtml(record.bio)}</p>` : ""}
      ${linkHtml
        ? `<div class="section-head"><span>تواصل معي</span><span class="count">${allLinks.length}</span></div>
           <div class="links">${linkHtml}</div>`
        : `<p class="empty">لا توجد روابط منشورة بعد.</p>`}
    </div>
  </main>
  <a class="footer" href="/" rel="noopener">
    <span class="dot"></span>
    <span>مدعوم بواسطة <strong>My Social QR</strong></span>
  </a>`;

  const pageTitle = `${name} - بطاقة التواصل الاجتماعي`;
  const linkLabels = [...new Set(allLinks.map((link) => link.label).filter(Boolean))].slice(0, 6);
  const descriptor = linkLabels.length
    ? `روابط ${name}: ${linkLabels.join("، ")}`
    : `الصفحة الشخصية لـ ${name}`;
  const description = clampText(
    `${name} - ${descriptor}${record.bio ? `. ${record.bio}` : ""}`,
    160
  );
  const canonical = `${origin}/u/${id}`;
  const shareImage = avatar || cover;
  const sameAs = [
    ...new Set(
      allLinks
        .map((link) => link.target)
        .filter((target) => /^https?:\/\//i.test(target))
    )
  ].slice(0, 20);

  const jsonLd = jsonLdScript({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": canonical,
    url: canonical,
    name: pageTitle,
    description,
    inLanguage: record.locale || "ar",
    isPartOf: {
      "@type": "WebSite",
      name: "My Social QR",
      url: `${origin}/`
    },
    mainEntity: {
      "@type": "Person",
      name,
      description: clampText(record.bio || `روابط ${name} في مكان واحد`, 160),
      ...(shareImage ? { image: shareImage } : {}),
      ...(sameAs.length ? { sameAs } : {})
    }
  });

  return new Response(pageShell(pageTitle, content, {
    description,
    image: shareImage,
    url: canonical,
    jsonLd
  }), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60",
      "access-control-allow-origin": "*"
    }
  });
}
