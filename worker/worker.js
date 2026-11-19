// Матешка · intermediario con Gemini (Cloudflare Worker).
// La clave de Gemini se guarda en Cloudflare como secreto GEMINI_KEY: no va en este archivo ni en la app.
// La app le manda {tarea:"traducir"|"explicar", texto, visto} y recibe {t, acc, notas}.

const ORIGENES = ["https://sirathrion18.github.io", "http://localhost:8765"];
const MODELOS = ["gemini-flash-latest", "gemini-2.5-flash"];

function cors(origin) {
  const ok = ORIGENES.includes(origin) ? origin : ORIGENES[0];
  return { "Access-Control-Allow-Origin": ok, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
}

function pedido(tarea, texto, visto) {
  const base = `Ayudás a Agus, que estudia ruso con su profesora. Habla castellano rioplatense y está en nivel A2.
LO QUE YA VIO
${visto || "(sin datos)"}
REGLAS
- Explicá en castellano simple. Marcá el acento (´) en todas las palabras rusas de más de una sílaba.
- Usá solo gramática y vocabulario de lo que ya vio. Si algo necesita un tema que no vio, decí «ADELANTO» y no lo expliques.
- Respondé SOLO con JSON válido, sin texto antes ni después.`;
  if (tarea === "explicar") {
    return `${base}
TAREA: ${texto}
Explicalo de otra forma, más simple, paso a paso y con ejemplos nuevos.
FORMATO: {"t": "la explicación, con saltos de línea", "notas": ["2 o 3 oraciones en ruso para que ella complete, con ___ y sin la respuesta"]}`;
  }
  return `${base}
TAREA: traducí este texto. Si está en ruso, al castellano; si está en castellano, al ruso.
TEXTO: ${texto}
FORMATO: {"t": "la traducción natural", "acc": "el texto en ruso (el original o tu traducción) con todos los acentos ´", "notas": ["hasta 3 notas cortas: caso, aspecto o forma de las palabras clave"]}`;
}

async function gemini(env, prompt) {
  if (!env.GEMINI_KEY) throw new Error("Falta el secreto GEMINI_KEY en Cloudflare");
  const modelos = env.MODEL ? [env.MODEL] : MODELOS;
  let ultimo = "";
  for (const m of modelos) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_KEY },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, responseMimeType: "application/json" } })
    });
    if (r.ok) {
      const d = await r.json();
      const txt = d?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "{}";
      try { return JSON.parse(txt); } catch { return { t: txt }; }
    }
    let det = "";
    try { const e = await r.json(); det = e?.error?.message || ""; } catch {}
    ultimo += `${m}: ${r.status} ${det}`.trim().slice(0, 300) + " | ";
    console.error("Gemini", m, r.status, det);
  }
  throw new Error(ultimo);
}

export default {
  async fetch(req, env) {
    const h = cors(req.headers.get("Origin") || "");
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (req.method !== "POST") {
      // Prueba desde el navegador: https://…workers.dev/?probar=1
      if (new URL(req.url).searchParams.has("probar")) {
        try {
          const r = await gemini(env, 'Respondé SOLO con JSON: {"t": "Привет! Funciona."}');
          return new Response("Матешка IA · Gemini responde bien: " + JSON.stringify(r), { headers: { ...h, "Content-Type": "text/plain; charset=utf-8" } });
        } catch (e) {
          return new Response("Матешка IA · Gemini dio error: " + String(e.message || e), { status: 502, headers: { ...h, "Content-Type": "text/plain; charset=utf-8" } });
        }
      }
      return new Response("Матешка IA · versión 2", { headers: { ...h, "Content-Type": "text/plain; charset=utf-8" } });
    }
    if (!ORIGENES.includes(req.headers.get("Origin") || "")) return new Response("no", { status: 403, headers: h });
    let b;
    try { b = await req.json(); } catch { return new Response("JSON inválido", { status: 400, headers: h }); }
    const texto = String(b.texto || "").slice(0, 2000);
    if (!texto.trim()) return new Response("Falta el texto", { status: 400, headers: h });
    try {
      const out = await gemini(env, pedido(b.tarea === "explicar" ? "explicar" : "traducir", texto, String(b.visto || "").slice(0, 4000)));
      return new Response(JSON.stringify(out), { headers: { ...h, "Content-Type": "application/json; charset=utf-8" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e.message || e) }), { status: 502, headers: { ...h, "Content-Type": "application/json" } });
    }
  }
};
