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

export async function onRequestGet({ params, env }) {
  const id = normalizeId(params.id);
  if (!id) return fail(400, "معرّف غير صالح");
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

  await env.PROFILES.put(PROFILE_KEY(id), JSON.stringify(record));
  return json({ ok: true, id, updatedAt: record.updatedAt });
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
      "access-control-allow-methods": "GET, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "content-type, authorization"
    }
  });
}
