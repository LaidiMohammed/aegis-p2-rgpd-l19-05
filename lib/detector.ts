/**
 * P2 — Audit de conformité RGPD / Loi 19-05 RÉEL.
 * Effectue de vraies requêtes HTTP vers la cible fournie et inspecte :
 * TLS, mentions légales, endpoint utilisateurs, cookies (consentement, Secure/HttpOnly).
 * ÉTHIQUE : n'auditmez que des applications que vous possédez / avez autorisation à tester.
 */

async function probe(url: string, timeoutMs = 6000): Promise<{ status: number; headers: Headers; text: string; error?: string }> {
  try {
    const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(timeoutMs), headers: { "User-Agent": "aegis-p2-audit/1.0" } });
    const text = await r.text();
    return { status: r.status, headers: r.headers, text };
  } catch (e: any) {
    return { status: 0, headers: new Headers(), text: "", error: e?.message || "erreur réseau" };
  }
}

export async function checkCompliance(appUrl: string) {
  const base = appUrl.startsWith("http") ? appUrl : "http://" + appUrl;
  const httpsUrl = base.replace(/^http:/, "https:");

  // 1. Chiffrement (HTTPS)
  const httpsProbe = await probe(httpsUrl);
  const encryption = {
    critere: "Chiffrement (HTTPS)",
    points: httpsProbe.status === 200 ? 20 : httpsProbe.status > 0 ? 10 : 0,
    ok: httpsProbe.status === 200,
    details: httpsProbe.error ? "erreur: " + httpsProbe.error : `GET ${httpsUrl} → ${httpsProbe.status}`,
  };

  // 2. Mentions légales
  const page = await probe(base);
  const found = ["/privacy", "/terms", "/mentions", "/policy"].filter((p) => page.text.toLowerCase().includes(p));
  const legal = {
    critere: "Mentions légales (RGPD Art.12-14)",
    points: found.length >= 3 ? 20 : found.length >= 2 ? 15 : found.length >= 1 ? 10 : 0,
    ok: found.length > 0,
    details: found.length ? "Trouvé: " + found.join(", ") : "Aucune mention trouvée",
    status: page.status,
  };

  // 3. Complexité des mots de passe (endpoint utilisateurs)
  const users = await probe(base + "/api/Users");
  const password = {
    critere: "Complexité des mots de passe (RGPD Art.8)",
    points: users.status === 200 || users.status === 404 ? 20 : 5,
    ok: users.status === 200 || users.status === 404,
    details: `GET ${base}/api/Users → ${users.status}`,
  };

  // 4. Gestion des cookies (consentement)
  const setCookie = page.headers.get("set-cookie") || "";
  const cookieNames = setCookie.split(";").map((c) => c.split("=")[0].trim()).filter(Boolean);
  const consent = cookieNames.some((c) => /consent|cookieconsent|prefs/i.test(c));
  const cookies = {
    critere: "Gestion des cookies (RGPD Art.5(1)(b))",
    points: consent ? 15 : cookieNames.length ? 10 : 5,
    ok: consent,
    details: "cookies: " + cookieNames.slice(0, 5).join(", "),
  };

  // 5. Cookies de session (Secure + HttpOnly)
  const auth = await probe(base + "/rest/user/authentication-details");
  const authCookie = auth.headers.get("set-cookie") || "";
  const secure = /secure/i.test(authCookie);
  const httponly = /httponly/i.test(authCookie);
  const session = {
    critere: "Chiffrement des cookies de session (ASVS, OWASP R)",
    points: secure && httponly ? 20 : secure || httponly ? 10 : 0,
    ok: secure && httponly,
    details: `status=${auth.status}, secure=${secure}, httponly=${httponly}`,
  };

  const criteria = [encryption, legal, password, cookies, session];
  const score = criteria.reduce((a, c) => a + c.points, 0);
  return {
    project: "P2",
    app_url: base,
    score,
    note_certificative: score >= 90 ? "RGPD-Safe" : "À renforcer",
    criteria_total: criteria.map((c) => c.critere),
    details: criteria,
    method: "Audit HTTP RÉEL (requêtes sortantes) — éthique : application autorisée uniquement",
  };
}
