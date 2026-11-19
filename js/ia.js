/* Матешка · conexión con la IA (Gemini a través de un Worker de Cloudflare).
   La clave de Gemini NO va acá: vive guardada en Cloudflare. Acá solo va la dirección del Worker.
   Mientras IA_URL esté vacía, la app funciona sin IA (traductor con tus libros y botones a Yandex / DeepL / Google). */
"use strict";
const IA_URL="https://mateshka-ia.nachocarp18.workers.dev";
async function iaPedir(body){const r=await fetch(IA_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 if(!r.ok){let t="";try{t=await r.text()}catch(e){}throw new Error(r.status+(t?": "+t.slice(0,160):""))}return r.json()}
