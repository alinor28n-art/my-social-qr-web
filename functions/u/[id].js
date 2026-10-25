import {
  escapeHtml,
  normalizeId,
  PROFILE_KEY,
  renderLink
} from "../_lib/profile.js";
import qrcode from "../_lib/qrcode.js";

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
    '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16.2 16.2 4.3 4.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  share:
    '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A3 3 0 1 0 5 15a2.99 2.99 0 0 0 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 1 0 2.92-2.92z"/>',
  location:
    '<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>',
  qr:
    '<path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h3v3h-3v-3zm5 0h3v3h-3v-3zm-5 5h3v3h-3v-3zm5 0h3v3h-3v-3z"/>',
  copy:
    '<path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>',
  download:
    '<path d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1zM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"/>',
  check:
    '<path d="M9.55 17.3 4.8 12.55l1.4-1.4 3.35 3.34 8.25-8.24 1.4 1.4z"/>'
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

function buildQrSvg(value) {
  const payload = String(value || "").trim();
  if (!payload) return "";
  try {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
    const qr = qrcode(0, "M");
    qr.addData(payload, "Byte");
    qr.make();
    return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  } catch (error) {
    return "";
  }
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
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#f3f4f6">
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
    --bg: #eef1f6;
    --surface: #ffffff;
    --surface-soft: #f6f8fc;
    --text: #0f172a;
    --text-soft: #52607a;
    --muted: #7d8aa0;
    --line: #e6ebf3;
    --brand: #2563eb;
    --brand-soft: #eef4ff;
    --ok: #0f9d6a;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; }
  body {
    min-height: 100vh;
    background:
      radial-gradient(900px 480px at 50% -10%, rgba(37,99,235,.10) 0%, transparent 60%),
      var(--bg);
    color: var(--text);
    font-family: "Segoe UI", "Noto Sans Arabic", "Noto Kufi Arabic", Tahoma, Arial, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  a { color: inherit; }
  button { font: inherit; }
  .page {
    width: 100%;
    max-width: 680px;
    min-height: 100vh;
    margin: 0 auto;
    background: var(--surface);
    border-inline: 1px solid rgba(15,23,42,.04);
  }
  .cover {
    position: relative;
    height: 188px;
    overflow: hidden;
    background: linear-gradient(135deg, #1d4ed8 0%, #4f46e5 52%, #9333ea 100%);
  }
  .cover::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    top: -190px;
    inset-inline-start: -70px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,.42) 0%, rgba(255,255,255,0) 68%);
  }
  .cover::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,.22) 1px, transparent 1.2px);
    background-size: 18px 18px;
    opacity: .5;
    mask-image: linear-gradient(180deg, #000 0%, transparent 90%);
  }
  .cover-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .cover-img.is-blur {
    filter: blur(24px) saturate(1.2);
    transform: scale(1.16);
    opacity: .92;
  }
  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(8,15,30,.04) 0%, rgba(8,15,30,.18) 55%, rgba(8,15,30,.55) 100%);
  }
  .cover-toolbar {
    position: absolute;
    top: max(12px, env(safe-area-inset-top));
    inset-inline-end: 12px;
    display: flex;
    gap: 8px;
    z-index: 2;
  }
  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.28);
    background: rgba(15,23,42,.34);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .18s ease, transform .18s ease;
  }
  .icon-btn:hover { background: rgba(15,23,42,.52); }
  .icon-btn:active { transform: scale(.96); }
  .icon-btn svg { width: 19px; height: 19px; }
  .profile-head { padding: 0 20px 18px; }
  .avatar-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: -56px;
  }
  .avatar-ring {
    width: 122px;
    height: 122px;
    border-radius: 50%;
    padding: 4px;
    background: var(--surface);
    box-shadow: 0 16px 34px -18px rgba(15,23,42,.55);
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
    font-size: 46px;
    font-weight: 800;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(0,0,0,.16);
  }
  h1 {
    margin: 14px 0 4px;
    font-size: clamp(24px, 6vw, 30px);
    line-height: 1.25;
    font-weight: 800;
    letter-spacing: -.4px;
    overflow-wrap: anywhere;
  }
  .meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    color: var(--text-soft);
    font-size: 13.5px;
    font-weight: 600;
  }
  .meta-item { display: inline-flex; align-items: center; gap: 6px; }
  .meta-item svg { width: 16px; height: 16px; color: var(--brand); flex: 0 0 auto; }
  .meta-dot { color: var(--line); font-size: 12px; }
  .bio {
    margin: 10px 0 0;
    color: var(--text-soft);
    font-size: 14.5px;
    line-height: 1.85;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px 20px;
  }
  .btn {
    flex: 1 1 0;
    min-width: 108px;
    height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--surface-soft);
    color: var(--text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
  }
  .btn svg { width: 19px; height: 19px; flex: 0 0 auto; }
  .btn.primary {
    background: var(--brand);
    border-color: var(--brand);
    color: #fff;
    box-shadow: 0 10px 22px -14px rgba(37,99,235,.9);
  }
  .btn.ghost { background: var(--surface); }
  .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -18px rgba(15,23,42,.55);
  }
  .btn.ghost:hover { background: var(--surface-soft); }
  .btn:active { transform: scale(.99); }
  .socials {
    padding: 18px 20px 20px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: var(--surface);
  }
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .section-head h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -.1px;
  }
  .section-head .count {
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 999px;
    background: var(--surface-soft);
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }
  .social-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 6px;
  }
  .social {
    width: 74px;
    padding: 4px 2px;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    color: var(--text);
    text-decoration: none;
    transition: background .16s ease;
  }
  .social:hover { background: var(--surface-soft); }
  .social-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: var(--brand, #2563eb);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 22px -16px var(--brand, #2563eb);
    transition: transform .18s ease;
  }
  .social-icon svg { width: 25px; height: 25px; }
  .social.dark .social-icon { color: #101828; }
  .social:hover .social-icon { transform: translateY(-2px) scale(1.03); }
  .social-label {
    max-width: 74px;
    color: var(--text-soft);
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qr-section {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    padding: 26px 20px 30px;
    background: linear-gradient(180deg, var(--surface-soft), var(--surface));
  }
  .qr-copy { flex: 1 1 250px; min-width: 0; }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--brand-soft);
    color: var(--brand);
    font-size: 11px;
    font-weight: 800;
  }
  .eyebrow svg { width: 14px; height: 14px; }
  .qr-copy h2 {
    margin: 10px 0 6px;
    font-size: 21px;
    line-height: 1.3;
    letter-spacing: -.2px;
  }
  .qr-desc {
    margin: 0;
    color: var(--text-soft);
    font-size: 13.5px;
    line-height: 1.8;
  }
  .qr-url {
    margin-top: 12px;
    direction: ltr;
    text-align: left;
    padding: 9px 11px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--surface);
    color: var(--muted);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qr-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
  .qr-actions .btn {
    flex: 0 1 auto;
    min-width: 0;
    height: 38px;
    padding: 0 12px;
    border-radius: 10px;
    font-size: 12.5px;
  }
  .qr-frame {
    flex: 0 0 auto;
    width: 170px;
    height: 170px;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: 22px;
    background: #fff;
    box-shadow: 0 18px 36px -28px rgba(15,23,42,.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qr-frame svg { width: 100%; height: 100%; display: block; }
  .qr-frame svg path { fill: #0f172a; }
  .qr-fallback {
    max-width: 120px;
    color: #64748b;
    font-size: 12px;
    line-height: 1.7;
    text-align: center;
  }
  .empty {
    margin: 0;
    padding: 20px;
    border-radius: 14px;
    background: var(--surface-soft);
    color: var(--text-soft);
    font-size: 13.5px;
    line-height: 1.8;
    text-align: center;
  }
  .socials > .empty { padding: 10px 0; background: transparent; }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 22px 20px max(26px, env(safe-area-inset-bottom));
    color: var(--muted);
    font-size: 11.5px;
    text-decoration: none;
  }
  .footer .dot {
    width: 8px;
    height: 8px;
    border-radius: 3px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }
  .footer strong { color: var(--text); font-weight: 700; }
  .toast {
    position: fixed;
    inset-inline: 0;
    bottom: max(22px, env(safe-area-inset-bottom));
    z-index: 50;
    width: max-content;
    max-width: calc(100% - 32px);
    margin: 0 auto;
    padding: 10px 16px;
    border-radius: 999px;
    background: #0f172a;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 18px 40px -20px rgba(15,23,42,.8);
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    transition: opacity .22s ease, transform .22s ease;
  }
  .toast.show { opacity: 1; transform: none; }
  .state-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .state-card { width: 100%; max-width: 420px; text-align: center; }
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
    box-shadow: 0 18px 34px -18px rgba(37,99,235,.7);
  }
  .state-icon svg { width: 34px; height: 34px; }
  .state-card h1 { margin: 0 0 8px; font-size: 21px; }
  .state-card .empty { padding: 0; background: transparent; }
  @media (min-width: 760px) {
    .page {
      margin-top: 28px;
      margin-bottom: 28px;
      min-height: calc(100vh - 56px);
      border: 1px solid var(--line);
    }
  }
  @media (min-width: 560px) {
    .cover { height: 218px; }
  }
  @media (max-width: 540px) {
    .qr-section {
      flex-direction: column-reverse;
      gap: 18px;
      text-align: center;
    }
    .qr-copy { text-align: center; }
    .qr-actions { justify-content: center; }
    .qr-url { text-align: center; }
    .qr-frame { width: 184px; height: 184px; }
  }
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
      --bg: #070d16;
      --surface: #0f1624;
      --surface-soft: #141d2e;
      --text: #f1f5f9;
      --text-soft: #aab7c9;
      --muted: #8492a6;
      --line: #223049;
      --brand: #3b82f6;
      --brand-soft: rgba(59,130,246,.16);
    }
    body {
      background:
        radial-gradient(900px 480px at 50% -10%, rgba(37,99,235,.22) 0%, transparent 60%),
        var(--bg);
    }
    .page { border-color: var(--line); }
    .icon-btn { background: rgba(2,6,15,.45); }
    .qr-frame { background: #fff; border-color: rgba(255,255,255,.08); }
    .qr-frame svg path { fill: #0f172a; }
    .toast { background: #f1f5f9; color: #0f172a; }
  }
  @media (prefers-reduced-motion: no-preference) {
    .profile-head, .actions, .socials, .qr-section {
      animation: fadeUp .5s cubic-bezier(.2,.8,.2,1) both;
    }
    .actions { animation-delay: .04s; }
    .socials { animation-delay: .08s; }
    .qr-section { animation-delay: .12s; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
</style>
<style>${CARD_STYLES}</style>
</head>
<body>${content}</body>
</html>`;
}

const CARD_STYLES = `
  :root {
    color-scheme: light;
    --biz-bg: #f3f4f6;
    --biz-ink: #0f172a;
    --biz-ink-2: #374151;
    --biz-soft: #6b7280;
    --biz-mute: #9ca3af;
    --biz-line: rgba(15,23,42,.07);
    --biz-glass: rgba(255,255,255,.66);
    --biz-shadow: 0 40px 90px -42px rgba(15,23,42,.42), 0 18px 44px -34px rgba(15,23,42,.26);
    --biz-soft-shadow: 0 14px 30px -22px rgba(15,23,42,.35), inset 0 1px 0 rgba(255,255,255,.92);
  }
  html, body { min-height: 100%; }
  body {
    margin: 0;
    overflow-x: hidden;
    background:
      radial-gradient(760px 520px at 12% -6%, rgba(255,255,255,.98) 0%, rgba(255,255,255,0) 62%),
      radial-gradient(680px 520px at 100% 12%, rgba(203,213,225,.55) 0%, rgba(203,213,225,0) 62%),
      radial-gradient(720px 560px at 46% 108%, rgba(226,232,240,.95) 0%, rgba(226,232,240,0) 66%),
      var(--biz-bg);
    color: var(--biz-ink);
    font-family: "Noto Kufi Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, Arial, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: .32;
    background-image: radial-gradient(rgba(148,163,184,.22) 1px, transparent 1.2px);
    background-size: 22px 22px;
    -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.28), transparent 45%, rgba(0,0,0,.18));
    mask-image: linear-gradient(180deg, rgba(0,0,0,.28), transparent 45%, rgba(0,0,0,.18));
  }
  .biz {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  .biz-card {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    width: 100%;
    max-width: none;
    min-height: 100vh;
    min-height: 100dvh;
    padding: max(18px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
    border-radius: 0;
    background:
      radial-gradient(680px 420px at 50% -150px, rgba(37,99,235,.14) 0%, rgba(37,99,235,0) 68%),
      linear-gradient(180deg, #ffffff 0%, #fbfcfe 46%, #f6f8fc 100%);
    border: 0;
    box-shadow: none;
    overflow: hidden;
  }
  .biz-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: radial-gradient(460px 240px at 50% -90px, rgba(37,99,235,.10), rgba(37,99,235,0) 70%);
  }
  .biz-card > * { position: relative; z-index: 1; }
  .biz-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 2px 10px;
  }
  .biz-brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--biz-soft);
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: .18em;
    text-transform: uppercase;
  }
  .biz-brand-mark {
    width: 28px;
    height: 28px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 9px;
    letter-spacing: .04em;
    background: linear-gradient(145deg, #4b5563 0%, #1f2937 70%);
    box-shadow: 0 8px 16px -10px rgba(15,23,42,.8), inset 0 1px 0 rgba(255,255,255,.28);
  }
  .biz-verified {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #111827;
    color: #fff;
    box-shadow: 0 4px 10px -6px rgba(15,23,42,.8);
  }
  .biz-verified svg { width: 9px; height: 9px; }
  .biz-top-action {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(15,23,42,.06);
    background: rgba(255,255,255,.68);
    color: var(--biz-ink-2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 10px 20px -16px rgba(15,23,42,.5), inset 0 1px 0 rgba(255,255,255,.9);
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
  }
  .biz-top-action:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 14px 24px -16px rgba(15,23,42,.5), inset 0 1px 0 #fff; }
  .biz-top-action:active { transform: scale(.97); }
  .biz-top-action svg { width: 17px; height: 17px; }
  .biz-head { padding: 0 2px 14px; }
  .biz-identity {
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: start;
  }
  .biz-identity-text { flex: 1 1 auto; min-width: 0; }
  .biz-photo {
    position: relative;
    flex: 0 0 auto;
    width: 78px;
    height: 78px;
    margin: 0;
    padding: 4px;
    border-radius: 50%;
    background: linear-gradient(145deg, #f8fafc 0%, #e5e7eb 100%);
    box-shadow:
      0 16px 30px -20px rgba(15,23,42,.5),
      0 6px 14px -12px rgba(15,23,42,.2),
      inset 0 1px 1px rgba(255,255,255,.98),
      inset 0 -3px 8px rgba(148,163,184,.2);
  }
  .biz-photo::before {
    content: "";
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.9);
    box-shadow: inset 0 2px 7px rgba(148,163,184,.22);
    pointer-events: none;
  }
  .biz-photo-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #111827 0%, #4b5563 100%);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.2);
  }
  .biz-photo-inner img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .biz-initial { color: #fff; font-size: 30px; font-weight: 800; line-height: 1; text-shadow: 0 4px 14px rgba(0,0,0,.24); }
  .biz-photo-badge {
    position: absolute;
    inset-inline-end: 2px;
    bottom: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #111827;
    border: 2px solid #f8fafc;
    box-shadow: 0 6px 12px -8px rgba(15,23,42,.65);
  }
  .biz-photo-badge svg { width: 9px; height: 9px; }
  .biz-head h1 {
    margin: 0;
    color: var(--biz-ink);
    font-size: clamp(20px, 5.6vw, 25px);
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -.4px;
    text-align: start;
    overflow-wrap: anywhere;
  }
  .biz-role {
    margin: 3px 0 0;
    color: var(--biz-soft);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .02em;
    text-align: start;
    overflow-wrap: anywhere;
  }
  .biz-tagline {
    max-width: none;
    margin: 8px 0 0;
    color: var(--biz-soft);
    font-size: 11.5px;
    line-height: 1.65;
    text-align: center;
    white-space: pre-line;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }
  .biz-chips { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; }
  .biz-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.62);
    border: 1px solid rgba(255,255,255,.92);
    color: var(--biz-soft);
    font-size: 10.5px;
    font-weight: 700;
    box-shadow: 0 7px 16px -14px rgba(15,23,42,.45), inset 0 1px 0 rgba(255,255,255,.95);
  }
  .biz-chip svg { width: 12px; height: 12px; color: var(--biz-ink-2); }
  .biz-chip.is-verified { color: #047857; }
  .biz-chip.is-verified svg { color: #059669; }
  .biz-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 0 0 14px;
  }
  .biz-actions > .biz-action:only-child { grid-column: 1 / -1; }
  .biz-action {
    position: relative;
    min-height: 42px;
    padding: 0 13px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,.14);
    background: linear-gradient(145deg, #4b5563 0%, #374151 48%, #1f2937 100%);
    box-shadow:
      0 16px 28px -18px rgba(31,41,55,.9),
      inset 0 1px 0 rgba(255,255,255,.2),
      inset 0 -2px 7px rgba(0,0,0,.28);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: .01em;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
  }
  .biz-action::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0) 52%);
    pointer-events: none;
  }
  .biz-action:hover { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 20px 34px -18px rgba(31,41,55,.95), inset 0 1px 0 rgba(255,255,255,.24), inset 0 -2px 7px rgba(0,0,0,.28); }
  .biz-action:active { transform: translateY(0) scale(.99); }
  .biz-action svg { width: 16px; height: 16px; flex: 0 0 auto; }
  .biz-action:last-child:nth-child(odd) { grid-column: 1 / -1; }
  .biz-social {
    padding: 12px 0 14px;
    border-top: 1px solid var(--biz-line);
    border-bottom: 1px solid var(--biz-line);
  }
  .biz-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
  .biz-panel-head h2 { margin: 0; color: var(--biz-ink-2); font-size: 10.5px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
  .biz-count { color: var(--biz-mute); font-size: 10px; font-weight: 700; }
  .biz-tiles { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 12px 6px; }
  .biz-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    padding: 2px;
    border-radius: 12px;
    background: transparent;
    border: 0;
    color: var(--tile, #374151);
    text-decoration: none;
    transition: transform .18s ease, opacity .18s ease;
  }
  .biz-tile:hover { transform: translateY(-2px); opacity: .82; }
  .biz-tile:active { transform: scale(.96); }
  .biz-tile svg { width: 34px; height: 34px; }
  .biz-tile-label {
    max-width: 100%;
    color: var(--biz-soft);
    font-size: 10.5px;
    font-weight: 700;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .biz-empty { margin: 0; padding: 16px; border-radius: 16px; background: rgba(255,255,255,.55); border: 1px solid rgba(255,255,255,.85); color: var(--biz-mute); font-size: 11px; text-align: center; }
  .biz-vcard {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
    margin: 14px 0 12px;
    padding: 14px;
    border-radius: 18px;
    background: #f7f9fc;
    border: 1px solid var(--biz-line);
    box-shadow: none;
  }
  .biz-qr {
    flex: 0 0 auto;
    width: 118px;
    height: 118px;
    padding: 9px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid var(--biz-line);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 14px 28px -24px rgba(15,23,42,.55);
  }
  .biz-qr svg { width: 100%; height: 100%; display: block; }
  .biz-qr svg path { fill: #0f172a; }
  .biz-qr-fallback { color: var(--biz-mute); font-size: 10px; line-height: 1.6; text-align: center; }
  .biz-vcard-copy { flex: 1 1 180px; min-width: 0; }
  .biz-eyebrow { color: var(--biz-mute); font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
  .biz-vcard-copy h2 { margin: 0 0 4px; color: var(--biz-ink); font-size: 14px; line-height: 1.35; letter-spacing: -.2px; }
  .biz-vcard-copy p { margin: 0; color: var(--biz-soft); font-size: 10.5px; line-height: 1.55; }
  .biz-vcard-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 7px 12px;
    border: 0;
    border-radius: 999px;
    background: #111827;
    color: #fff;
    font-size: 10.5px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 12px 22px -14px rgba(17,24,39,.85), inset 0 1px 0 rgba(255,255,255,.2);
    transition: transform .18s ease, box-shadow .18s ease;
  }
  .biz-vcard-btn:hover { transform: translateY(-1px); box-shadow: 0 16px 26px -14px rgba(17,24,39,.9), inset 0 1px 0 rgba(255,255,255,.24); }
  .biz-vcard-btn svg { width: 13px; height: 13px; }
  .biz-vcard-note { display: none; }
  .biz-footer { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-top: auto; padding-top: 2px; }
  .biz-footer-icons { display: flex; align-items: center; gap: 7px; }
  .biz-footer-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 0;
    background: transparent;
    color: var(--biz-soft);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    cursor: pointer;
    transition: transform .18s ease, color .18s ease;
  }
  .biz-footer-icon:hover { transform: translateY(-2px); background: transparent; color: var(--biz-ink); }
  .biz-footer-icon svg { width: 15px; height: 15px; }
  .biz-footer-meta { display: flex; align-items: center; gap: 5px; color: var(--biz-mute); font-size: 9px; letter-spacing: .02em; }
  .biz-footer-meta strong { color: var(--biz-ink-2); font-weight: 700; }
  .biz-check { color: #059669; display: inline-flex; align-items: center; }
  .biz-check svg { width: 11px; height: 11px; }
  .biz-toast {
    position: fixed;
    inset-inline: 0;
    bottom: max(22px, env(safe-area-inset-bottom));
    z-index: 80;
    width: max-content;
    max-width: calc(100% - 32px);
    margin: 0 auto;
    padding: 10px 16px;
    border-radius: 999px;
    background: #111827;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 18px 40px -20px rgba(15,23,42,.85);
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    transition: opacity .22s ease, transform .22s ease;
  }
  .biz-toast.show { opacity: 1; transform: none; }
  .state-card {
    padding: 28px 22px;
    border-radius: 28px;
    background: rgba(255,255,255,.72);
    border: 1px solid rgba(255,255,255,.92);
    box-shadow: var(--biz-soft-shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }
  .state-icon {
    background: linear-gradient(145deg, #4b5563 0%, #1f2937 100%);
    box-shadow: 0 18px 34px -18px rgba(15,23,42,.6);
  }
  @media (max-width: 420px) {
    .biz-card { padding: max(14px, env(safe-area-inset-top)) 16px max(18px, env(safe-area-inset-bottom)); }
    .biz-photo { width: 72px; height: 72px; }
    .biz-initial { font-size: 27px; }
    .biz-action { min-height: 40px; font-size: 11px; padding: 0 10px; }
    .biz-tiles { gap: 10px 5px; }
    .biz-tile svg { width: 32px; height: 32px; }
    .biz-vcard { gap: 12px; padding: 12px; }
    .biz-qr { width: 104px; height: 104px; padding: 8px; border-radius: 12px; }
  }
  @media (max-height: 700px) {
    .biz-card { padding-top: max(10px, env(safe-area-inset-top)); padding-bottom: max(12px, env(safe-area-inset-bottom)); }
    .biz-photo { width: 62px; height: 62px; }
    .biz-initial { font-size: 24px; }
    .biz-head { padding-bottom: 10px; }
    .biz-tagline { -webkit-line-clamp: 1; line-clamp: 1; }
    .biz-actions { margin-bottom: 10px; }
    .biz-action { min-height: 38px; }
    .biz-social { padding: 10px 0 12px; }
    .biz-tile svg { width: 28px; height: 28px; }
    .biz-qr { width: 96px; height: 96px; }
    .biz-vcard { margin: 10px 0 8px; }
    .biz-footer { gap: 4px; }
  }
  @media (min-width: 720px) {
    body {
      background:
        radial-gradient(900px 520px at 50% -10%, rgba(37,99,235,.10) 0%, transparent 60%),
        var(--biz-bg);
    }
    body::before { display: none; }
    .biz {
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
    }
    .biz-card {
      flex: 0 0 auto;
      max-width: 460px;
      min-height: 0;
      padding: 22px 24px 20px;
      border-radius: 32px;
      border: 1px solid rgba(15,23,42,.07);
      box-shadow: var(--biz-shadow);
    }
    .biz-photo { width: 88px; height: 88px; }
    .biz-qr { width: 128px; height: 128px; }
    .biz-tile svg { width: 36px; height: 36px; }
    .biz-footer { margin-top: 0; }
  }
  @media (prefers-reduced-motion: no-preference) {
    .biz-head, .biz-actions, .biz-social, .biz-vcard, .biz-footer { animation: bizRise .55s cubic-bezier(.2,.8,.2,1) both; }
    .biz-actions { animation-delay: .05s; }
    .biz-social { animation-delay: .09s; }
    .biz-vcard { animation-delay: .13s; }
    .biz-footer { animation-delay: .17s; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
  @keyframes bizRise {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
`;

function vcardEscape(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function buildVCard({ name, headline, country, canonical, phone, email }) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${vcardEscape(clampText(name, 80))};;;`,
    `FN:${vcardEscape(clampText(name, 80))}`
  ];
  if (headline) lines.push(`TITLE:${vcardEscape(clampText(headline, 40))}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${vcardEscape(phone)}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${vcardEscape(email)}`);
  lines.push(`URL:${vcardEscape(canonical)}`);
  if (country) lines.push(`ADR;TYPE=WORK:;;;;;;${vcardEscape(clampText(country, 30))}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

function errorPage(status, title, message) {
  const content = `<main class="state-page">
    <div class="state-card">
      <div class="state-icon">${iconSvg("search")}</div>
      <h1>${escapeHtml(title)}</h1>
      <p class="empty">${escapeHtml(message)}</p>
    </div>
  </main>`;
  return new Response(pageShell(title, content, { robots: "noindex, nofollow" }), {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
  });
}

function renderBusinessCard({ record, origin, canonical, name, initial, country }) {
  const resolveUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (raw.startsWith("/")) return `${origin}${raw}`;
    return /^https?:\/\//i.test(raw) ? raw : "";
  };

  const avatar = resolveUrl(record.avatar);
  const cover = resolveUrl(record.cover);
  const headline = String(record.headline || "").trim();
  const bio = String(record.bio || "").trim();
  const cvUrl = resolveUrl(record.cvUrl);
  const links = (record.links || [])
    .filter((link) => link.visible !== false)
    .map(renderLink)
    .filter(Boolean);
  const socialLinks = links.filter((link) => link.platform !== "phone" && link.platform !== "email");
  const linkedin = links.find((link) => link.platform === "linkedin");
  const contact = record.contact || {};
  const phone = contact.showPhone ? String(contact.phone || "").trim() : "";
  const email = contact.showEmail ? String(contact.email || "").trim() : "";
  const vcard = buildVCard({ name, headline, country, canonical, phone, email });
  const qrSvg = buildQrSvg(canonical) || buildQrSvg(vcard);
  const pageTitle = `${name} - ${headline || "بطاقة أعمال رقمية"}`;
  const description = clampText(
    [name, headline, bio].filter(Boolean).join(" — ") || `بطاقة أعمال ${name}`,
    160
  );
  const shareImage = avatar || cover;
  const year = new Date().getFullYear();

  const actionItems = [];
  if (email) actionItems.push({ label: "راسلني بالبريد", icon: "email", href: `mailto:${email}` });
  if (phone) actionItems.push({ label: "اتصل بي", icon: "phone", href: `tel:${phone}` });
  if (linkedin) actionItems.push({ label: "لينكدإن", icon: "linkedin", href: linkedin.target });
  if (cvUrl) actionItems.push({ label: "تحميل السيرة الذاتية", icon: "download", href: cvUrl });

  const actionsHtml = actionItems.length
    ? actionItems
        .map((item) => {
          const external = /^https?:\/\//i.test(item.href);
          return `<a class="biz-action" href="${escapeHtml(item.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${iconSvg(item.icon)}<span>${escapeHtml(item.label)}</span></a>`;
        })
        .join("")
    : `<button class="biz-action" type="button" data-share>${iconSvg("share")}<span>مشاركة البطاقة</span></button>`;

  const socialHtml = socialLinks
    .map((link) => {
      const subtitle = linkSubtitle(link);
      const title = subtitle ? `${link.label} — ${subtitle}` : link.label;
      const tileColor = link.dark ? "#111827" : link.color;
      return `<a class="biz-tile" href="${escapeHtml(link.target)}" target="_blank" rel="noopener noreferrer" style="--tile:${escapeHtml(tileColor)}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">${iconSvg(link.platform)}<span class="biz-tile-label">${escapeHtml(link.label)}</span></a>`;
    })
    .join("");

  const tileColumns = Math.min(5, Math.max(3, socialLinks.length));
  const socialSection = socialLinks.length
    ? `<section class="biz-social">
      <div class="biz-panel-head"><h2>حسابات التواصل</h2><span class="biz-count">${socialLinks.length}</span></div>
      <div class="biz-tiles" style="--cols:${tileColumns}">${socialHtml}</div>
    </section>`
    : "";

  const chips = [];
  if (country) {
    chips.push(`<span class="biz-chip">${iconSvg("location")}<span>${escapeHtml(country)}</span></span>`);
  }
  chips.push(`<span class="biz-chip is-verified">${iconSvg("check")}<span>موثّق</span></span>`);
  const chipsHtml = `<div class="biz-chips">${chips.join("")}</div>`;

  const vcardSection = `<section class="biz-vcard" id="vcard">
    <div class="biz-qr" aria-label="باركود البطاقة">${qrSvg || `<span class="biz-qr-fallback">تعذر عرض الباركود. استخدم زر التحميل.</span>`}</div>
    <div class="biz-vcard-copy">
      <h2>امسح الباركود لفتح البطاقة</h2>
      <p>نفس الباركود الموجود في التطبيق — امسحه للوصول إلى صفحتي أو مشاركتها.</p>
      <button class="biz-vcard-btn" type="button" data-download-vcard>${iconSvg("download")}<span>تحميل جهة الاتصال</span></button>
    </div>
  </section>`;

  const footer = `<footer class="biz-footer">
    <div class="biz-footer-icons">
      <a class="biz-footer-icon" href="#vcard" aria-label="الباركود">${iconSvg("qr")}</a>
      <button class="biz-footer-icon" type="button" data-share aria-label="مشاركة البطاقة">${iconSvg("share")}</button>
      <button class="biz-footer-icon" type="button" data-copy aria-label="نسخ الرابط">${iconSvg("copy")}</button>
      <a class="biz-footer-icon" href="/" aria-label="الصفحة الرئيسية">${iconSvg("website")}</a>
    </div>
    <div class="biz-footer-meta">
      <span class="biz-check">${iconSvg("check")}</span>
      <span>موثّق · © ${year} <strong>My Social QR</strong></span>
    </div>
  </footer>`;

  const content = `<div class="biz">
    <main class="biz-card">
      <div class="biz-topbar">
        <div class="biz-brand">
          <span class="biz-brand-mark">MS</span>
          <span>My Social QR</span>
          <span class="biz-verified">${iconSvg("check")}</span>
        </div>
        <button class="biz-top-action" type="button" data-share aria-label="مشاركة البطاقة">${iconSvg("share")}</button>
      </div>
      <header class="biz-head">
        <div class="biz-identity">
          <div class="biz-photo">
            <div class="biz-photo-inner">
              <span class="biz-initial">${escapeHtml(initial)}</span>
              ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" loading="eager" onerror="this.remove()">` : ""}
            </div>
            <span class="biz-photo-badge" title="موثّق">${iconSvg("check")}</span>
          </div>
          <div class="biz-identity-text">
            <h1>${escapeHtml(name)}</h1>
            <p class="biz-role" dir="auto">${escapeHtml(headline || "بطاقة أعمال رقمية")}</p>
          </div>
        </div>
        ${bio ? `<p class="biz-tagline">${escapeHtml(bio)}</p>` : ""}
        ${chipsHtml}
      </header>
      <section class="biz-actions">${actionsHtml}</section>
      ${socialSection}
      ${vcardSection}
      ${footer}
    </main>
    <div class="biz-toast" id="toast" role="status" aria-live="polite"></div>
  </div>`;

  const shareConfig = jsonLdScript({
    title: `${name} - ${headline || "بطاقة أعمال رقمية"}`,
    text: `بطاقة ${name}${headline ? ` — ${headline}` : ""}`,
    url: canonical,
    vcard,
    fileName: `${String(name).replace(/[\\/:*?"<>|]+/g, "").trim().slice(0, 60) || "contact"}.vcf`
  });

  const scripts = `<script>
(function () {
  var shareData = ${shareConfig};
  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy"));
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function copyLink() {
    copyText(shareData.url)
      .then(function () { showToast("تم نسخ الرابط"); })
      .catch(function () { showToast("تعذر نسخ الرابط"); });
  }

  function sharePage() {
    if (navigator.share) {
      navigator.share({ title: shareData.title, text: shareData.text, url: shareData.url }).catch(function (error) {
        if (error && error.name === "AbortError") return;
        copyLink();
      });
    } else {
      copyLink();
    }
  }

  function downloadVcard() {
    if (!shareData.vcard) {
      showToast("تعذر تجهيز جهة الاتصال");
      return;
    }
    try {
      var blob = new Blob([shareData.vcard], { type: "text/vcard;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = shareData.fileName || "contact.vcf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      showToast("تم تنزيل بطاقة جهة الاتصال");
    } catch (error) {
      showToast("تعذر تنزيل vCard");
    }
  }

  var shareButtons = document.querySelectorAll("[data-share]");
  for (var i = 0; i < shareButtons.length; i += 1) {
    shareButtons[i].addEventListener("click", sharePage);
  }
  var copyButtons = document.querySelectorAll("[data-copy]");
  for (var j = 0; j < copyButtons.length; j += 1) {
    copyButtons[j].addEventListener("click", copyLink);
  }
  var downloadButtons = document.querySelectorAll("[data-download-vcard]");
  for (var k = 0; k < downloadButtons.length; k += 1) {
    downloadButtons[k].addEventListener("click", downloadVcard);
  }

})();
</script>`;

  const sameAs = [
    ...new Set(
      links
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
      ...(headline ? { jobTitle: headline } : {}),
      ...(bio ? { description: clampText(bio, 160) } : {}),
      ...(shareImage ? { image: shareImage } : {}),
      ...(country ? { homeLocation: { "@type": "Place", name: country } } : {}),
      ...(email ? { email: `mailto:${email}` } : {}),
      ...(phone ? { telephone: phone } : {}),
      ...(sameAs.length ? { sameAs } : {})
    }
  });

  return new Response(pageShell(pageTitle, content + scripts, {
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
  const canonical = `${origin}/u/${id}`;
  const name = (record.name || "").trim() || "بطاقة شخصية";
  const initial = name.trim().charAt(0).toUpperCase() || "؟";
  const country = String(record.country || "").trim();

  return renderBusinessCard({ record, origin, canonical, name, initial, country });
}
