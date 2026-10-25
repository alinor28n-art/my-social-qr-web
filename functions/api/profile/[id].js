import {
  PROFILE_KEY,
  AVATAR_KEY,
  fail,
  json,
  normalizeId,
  publicProfile,
  sanitizeProfile,
  sha256Hex,
  verifyEditToken
} from "../../_lib/profile.js";

function avatarIdFromUrl(value, origin, profileId) {
  if (typeof value !== "string" || !value) return "";
  try {
    const url = new URL(value, origin);
    const match = url.pathname.match(/^\/api\/avatar\/([a-z0-9]{4,16})$/);
    if (!match) return "";
    const isLocal =
      value.startsWith("/api/avatar/") ||
      url.origin === origin ||
      match[1] === profileId;
    return isLocal ? match[1] : "";
  } catch (e) {
    return "";
  }
}

export async function onRequestGet({ params, request, env }) {
  const id = normalizeId(params.id);
  if (!id) return fail(400, "معرّف غير صالح");
  const url = new URL(request.url);
  if (url.searchParams.has("check")) {
    const exists = await env.PROFILES.get(PROFILE_KEY(id));
    return json({ id, available: !exists });
  }
  const record = await env.PROFILES.get(PROFILE_KEY(id), { type: "json" });
  if (!record) return fail(404, "الصفحة غير موجودة");
  return json(publicProfile(record));
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

  const profile = sanitizeProfile(body?.profile, id, existing);
  const record = {
    ...profile,
    tokenHash: existing?.tokenHash || (await sha256Hex(token))
  };

  await env.PROFILES.put(PROFILE_KEY(id), JSON.stringify(record), {
    metadata: {
      enabled: record.enabled !== false,
      updatedAt: record.updatedAt
    }
  });
  return json({ ok: true, id, updatedAt: record.updatedAt });
}

export async function onRequestPost({ params, request, env }) {
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

  const newId = normalizeId(body?.newId);
  if (!newId) return fail(400, "اسم الرابط غير صالح");

  const record = await env.PROFILES.get(PROFILE_KEY(id), { type: "json" });
  if (!record) return fail(404, "الصفحة غير موجودة");
  if (!(await verifyEditToken(record, token))) {
    return fail(401, "رمز التعديل غير صحيح أو لا تملك صلاحية");
  }
  if (newId === id) return json({ ok: true, id, avatar: record.avatar || "" });

  const taken = await env.PROFILES.get(PROFILE_KEY(newId));
  if (taken) return fail(409, "هذا الاسم محجوز، اختر اسماً آخر");

  const origin = new URL(request.url).origin;
  const now = Date.now();
  const avatarId = avatarIdFromUrl(record.avatar, origin, id);
  const sourceId = avatarId || id;
  const stored = await env.PROFILES.getWithMetadata(AVATAR_KEY(sourceId), {
    type: "arrayBuffer"
  });
  let avatar = record.avatar || "";

  if (stored.value) {
    await env.PROFILES.put(AVATAR_KEY(newId), stored.value, {
      metadata: stored.metadata || { contentType: "image/jpeg" }
    });
    if (avatarId && avatar.includes(`/api/avatar/${avatarId}`)) {
      avatar = avatar.replace(`/api/avatar/${avatarId}`, `/api/avatar/${newId}`);
    } else if (!avatar) {
      avatar = `${origin}/api/avatar/${newId}?v=${now}`;
    }
  } else if (avatarId && avatar.includes(`/api/avatar/${avatarId}`)) {
    avatar = "";
  }

  const updated = { ...record, id: newId, avatar, updatedAt: now };
  await env.PROFILES.put(PROFILE_KEY(newId), JSON.stringify(updated), {
    metadata: { enabled: updated.enabled !== false, updatedAt: now }
  });
  await Promise.all([
    env.PROFILES.delete(PROFILE_KEY(id)),
    env.PROFILES.delete(AVATAR_KEY(id))
  ]);

  return json({ ok: true, id: newId, avatar });
}

export async function onRequestDelete({ params, request, env }) {
  const id = normalizeId(params.id);
  if (!id) return fail(400, "معرّف غير صالح");

  const record = await env.PROFILES.get(PROFILE_KEY(id), { type: "json" });
  if (!record) return json({ ok: true });

  const header = request.headers.get("authorization") || "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!(await verifyEditToken(record, token))) {
    return fail(401, "رمز التعديل غير صحيح أو لا تملك صلاحية");
  }

  await Promise.all([
    env.PROFILES.delete(PROFILE_KEY(id)),
    env.PROFILES.delete(AVATAR_KEY(id))
  ]);
  return json({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "content-type, authorization"
    }
  });
}
