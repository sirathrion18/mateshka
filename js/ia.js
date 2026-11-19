/* Матешка · conexión con la IA (Gemini a través de un Worker de Cloudflare).
   La clave de Gemini NO va acá: vive guardada en Cloudflare. Acá solo va la dirección del Worker.
   Mientras IA_URL esté vacía, la app funciona sin IA (traductor con tus libros y botones a Yandex / DeepL / Google). */
"use strict";
const IA_URL="";
async function iaPedir(body){const r=await fetch(IA_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 if(!r.ok)throw new Error("IA "+r.status);return r.json()}
