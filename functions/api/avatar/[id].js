import {
  AVATAR_KEY,
  MAX_AVATAR_BYTES,
  PROFILE_KEY,
  fail,
  json,
  normalizeId,
  sha256Hex,
  verifyEditToken
} from "../../_lib/profile.js";

function decodeBase64(value) {
  const clean = String(value || "").replace(/^data:[^;]+;base64,/, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function contentType(value) {
  return value === "image/png" || value === "image/webp" ? value : "image/jpeg";
}

export async function onRequestGet({ params, env }) {
  const id = normalizeId(params.id);
  if (!id) return fail(400, "معرّف غير صالح");

  const stored = await env.PROFILES.getWithMetadata(AVATAR_KEY(id), { type: "arrayBuffer" });
  if (!stored.value) return fail(404, "الصورة غير موجودة");

  return new Response(stored.value, {
    headers: {
      "content-type": stored.metadata?.contentType || "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
      "access-control-allow-origin": "*"
    }
  });
}

export async function onRequestPut({ params, request, env }) {
  const id = normalizeId(params.id);
  if (!id) return fail(400, "معرّف غير صالح");

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return fail(400, "طلب غير صالح");
  }

  const token = typeof body?.editToken === "string" ? body.editToken : "";
  if (token.length < 16 || token.length > 128) {
    return fail(401, "رمز التعديل غير صحيح أو لا تملك صلاحية");
  }

  const existing = await env.PROFILES.get(PROFILE_KEY(id), { type: "json" });
  if (existing && !(await verifyEditToken(existing, token))) {
    return fail(401, "رمز التعديل غير صحيح أو لا تملك صلاحية");
  }

  const encoded = String(body?.imageBase64 || "");
  if (!encoded) return fail(400, "الصورة مطلوبة");
  if (encoded.length > MAX_AVATAR_BYTES * 1.4) {
    return fail(413, "الصورة كبيرة جداً");
  }

  let bytes;
  try {
    bytes = decodeBase64(encoded);
  } catch (e) {
    return fail(400, "بيانات الصورة غير صالحة");
  }
  if (!bytes.length || bytes.length > MAX_AVATAR_BYTES) {
    return fail(413, "الصورة كبيرة جداً");
  }

  const type = contentType(body?.contentType);
  const now = Date.now();

  await env.PROFILES.put(AVATAR_KEY(id), bytes, {
    metadata: { contentType: type }
  });

  const origin = new URL(request.url).origin;
  const avatarUrl = `${origin}/api/avatar/${id}?v=${now}`;

  if (existing) {
    const updated = { ...existing, avatar: avatarUrl, updatedAt: now };
    await env.PROFILES.put(PROFILE_KEY(id), JSON.stringify(updated), {
      metadata: { enabled: updated.enabled !== false, updatedAt: now }
    });
  } else {
    const placeholder = {
      id,
      name: "",
      bio: "",
      avatar: avatarUrl,
      locale: "ar",
      contact: { phone: "", email: "", showPhone: false, showEmail: false },
      links: [],
      enabled: true,
      createdAt: now,
      updatedAt: now,
      tokenHash: await sha256Hex(token)
    };
    await env.PROFILES.put(PROFILE_KEY(id), JSON.stringify(placeholder), {
      metadata: { enabled: true, updatedAt: now }
    });
  }

  return json({ avatar: avatarUrl });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, PUT, OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}
