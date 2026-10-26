export const PROFILE_KEY = (id) => `profile:${id}`;
export const AVATAR_KEY = (id) => `avatar:${id}`;

export const ID_RE = /^[a-z0-9]{4,16}$/;
export const MAX_LINKS = 30;
export const MAX_AVATAR_BYTES = 1024 * 1024;

const PLATFORM_KEYS = new Set([
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "whatsapp",
  "snapchat",
  "tiktok",
  "telegram",
  "linkedin",
  "github",
  "threads",
  "discord",
  "pinterest",
  "website",
  "email",
  "phone",
  "custom"
]);

const KNOWN_HOSTS = [
  "instagram.com",
  "facebook.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "tiktok.com",
  "wa.me",
  "t.me",
  "linkedin.com",
  "github.com",
  "snapchat.com",
  "threads.net",
  "pinterest.com",
  "discord.gg",
  "discord.com"
];

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      ...extra
    }
  });
}

export function fail(status, message) {
  return json({ error: message }, status);
}

export function normalizeId(raw) {
  const id = String(raw || "").trim().toLowerCase();
  return ID_RE.test(id) ? id : null;
}

export function text(value, max) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

function boolean(value) {
  return value === true;
}

function safeImage(value, previous, pathPrefix) {
  const image = text(value, 500);
  if (!image) return previous || "";
  if (image.startsWith(pathPrefix)) return image;
  if (/^https?:\/\//i.test(image)) return image;
  return previous || "";
}

function safeAvatar(value, previous) {
  const avatar = text(value, 500);
  if (!avatar) return "";
  if (avatar.startsWith("/api/avatar/")) return avatar;
  if (/^https?:\/\//i.test(avatar)) return avatar;
  return previous?.avatar || "";
}

function safeCover(value, previous) {
  return safeImage(value, previous?.cover, "/api/cover/");
}

function safeCvUrl(value, previous) {
  const url = text(value, 500);
  if (!url) return "";
  if (/^https?:\/\//i.test(url) && !/\s/.test(url)) return url;
  return previous || "";
}

function safeContact(value) {
  const src = value && typeof value === "object" ? value : {};
  return {
    phone: text(src.phone, 32),
    email: text(src.email, 160),
    showPhone: boolean(src.showPhone),
    showEmail: boolean(src.showEmail)
  };
}

function safeLinks(value, previous) {
  if (!Array.isArray(value)) return previous?.links || [];
  return value
    .slice(0, MAX_LINKS)
    .map((item) => {
      const src = item && typeof item === "object" ? item : {};
      const platform = text(src.platform, 24).toLowerCase();
      if (!PLATFORM_KEYS.has(platform)) return null;
      return {
        platform,
        label: text(src.label, 60),
        value: text(src.value, 300),
        visible: src.visible !== false
      };
    })
    .filter((link) => link && link.value);
}

export function sanitizeProfile(input, id, previous) {
  const src = input && typeof input === "object" ? input : {};
  return {
    id,
    name: text(src.name, 80) || previous?.name || "",
    headline: text(src.headline, 80),
    bio: text(src.bio, 300),
    cvUrl: safeCvUrl(src.cvUrl, previous?.cvUrl),
    country: text(src.country, 60),
    avatar: safeAvatar(src.avatar, previous),
    cover: safeCover(src.cover, previous),
    locale: text(src.locale, 8) || "ar",
    contact: safeContact(src.contact),
    links: safeLinks(src.links, previous),
    enabled: src.enabled !== false,
    createdAt: previous?.createdAt || Date.now(),
    updatedAt: Date.now()
  };
}

export function publicProfile(record) {
  if (!record) return null;
  return {
    id: record.id,
    name: record.name || "",
    headline: record.headline || "",
    bio: record.bio || "",
    cvUrl: record.cvUrl || "",
    country: record.country || "",
    avatar: record.avatar || "",
    cover: record.cover || "",
    locale: record.locale || "ar",
    contact: record.contact || {
      phone: "",
      email: "",
      showPhone: false,
      showEmail: false
    },
    links: record.links || [],
    enabled: record.enabled !== false,
    updatedAt: record.updatedAt || 0
  };
}

export async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyEditToken(record, token) {
  if (!record?.tokenHash || typeof token !== "string" || token.length < 16) {
    return false;
  }
  return constantTimeEqual(record.tokenHash, await sha256Hex(token));
}

export function bearerToken(request) {
  const header = request.headers.get("authorization") || "";
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function customLinkTarget(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  const lower = v.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return v;
  if (lower.startsWith("mailto:") || lower.startsWith("tel:")) return v;
  if (lower.startsWith("//")) return `https:${v}`;
  if (v.includes(".") && !v.includes(" ")) return `https://${v.replace(/^www\./, "")}`;
  return "";
}

function platformTarget(platform, value) {
  const v = String(value || "").trim();
  if (!v) return "";
  const lower = v.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return v;
  if (
    lower.startsWith("www.") ||
    KNOWN_HOSTS.some(
      (host) => lower.startsWith(host) || lower.startsWith(`www.${host}`) || lower.startsWith(`m.${host}`)
    )
  ) {
    return `https://${v.replace(/^\/\//, "")}`;
  }
  const handle = v.replace(/^@/, "");
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/${v.replace(/\D/g, "")}`;
    case "email":
      return lower.startsWith("mailto:") ? v : `mailto:${v}`;
    case "phone":
      return lower.startsWith("tel:") ? v : `tel:${v}`;
    case "website":
      return `https://${v.replace(/^\/\//, "")}`;
    case "instagram":
      return `https://www.instagram.com/${handle}`;
    case "facebook":
      return `https://www.facebook.com/${handle}`;
    case "twitter":
      return `https://x.com/${handle}`;
    case "youtube":
      return `https://www.youtube.com/@${handle}`;
    case "snapchat":
      return `https://www.snapchat.com/add/${handle}`;
    case "tiktok":
      return `https://www.tiktok.com/@${handle}`;
    case "telegram":
      return `https://t.me/${handle}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${handle}`;
    case "github":
      return `https://github.com/${handle}`;
    case "threads":
      return `https://www.threads.net/@${handle}`;
    case "pinterest":
      return `https://www.pinterest.com/${handle}`;
    case "discord":
      return lower.startsWith("http") ? v : `https://discord.gg/${handle}`;
    case "custom":
      return customLinkTarget(v);
    default:
      return customLinkTarget(v);
  }
}

const PLATFORM_META = {
  instagram: { label: "إنستغرام", color: "#E1306C", letter: "IG" },
  facebook: { label: "فيسبوك", color: "#1877F2", letter: "f" },
  twitter: { label: "إكس (تويتر)", color: "#111111", letter: "X" },
  youtube: { label: "يوتيوب", color: "#FF0000", letter: "YT" },
  whatsapp: { label: "واتساب", color: "#25D366", letter: "WA" },
  snapchat: { label: "سناب شات", color: "#FFFC00", letter: "SC", dark: true },
  tiktok: { label: "تيك توك", color: "#111111", letter: "TT" },
  telegram: { label: "تيليجرام", color: "#229ED9", letter: "TG" },
  linkedin: { label: "لينكدإن", color: "#0A66C2", letter: "IN" },
  github: { label: "جيت هب", color: "#181717", letter: "GH" },
  threads: { label: "ثريدز", color: "#111111", letter: "TH" },
  discord: { label: "ديسكورد", color: "#5865F2", letter: "DC" },
  pinterest: { label: "بينترست", color: "#BD081C", letter: "P" },
  website: { label: "موقع إلكتروني", color: "#2563EB", letter: "WEB" },
  email: { label: "بريد إلكتروني", color: "#EA4335", letter: "@" },
  phone: { label: "هاتف", color: "#10B981", letter: "PH" },
  custom: { label: "رابط", color: "#2563EB", letter: "L" }
};

export function renderLink(link) {
  const meta = PLATFORM_META[link.platform] || PLATFORM_META.custom;
  const label = link.label || meta.label;
  const target = platformTarget(link.platform, link.value);
  if (!target) return null;
  return {
    platform: link.platform,
    label,
    customLabel: Boolean(String(link.label || "").trim()),
    target,
    color: meta.color,
    letter: meta.letter,
    dark: Boolean(meta.dark)
  };
}
