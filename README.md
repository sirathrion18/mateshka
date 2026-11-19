# Матешка

Bitácora de estudio de ruso: biblioteca de libros con lo visto (A1, Primeros pasos y A2 completo), tablas de casos (animado e inanimado), pares de verbos perfectivo / imperfectivo, fichas, repaso y tres juegos diarios (escribir, casos y verbos) con racha y festejos. El botón ¡Davaicito! lleva al próximo juego del día.

Código: `index.html` (estructura), `css/app.css` (diseño Pop pastel, claro y oscuro), `js/` (datos, A2 24–40, bancos de los juegos, festejos, app). Al cambiar algo, subí `?v=` en `index.html` y `sw.js`, y `VERSION` en `sw.js`.

Abrila en Safari en `https://sirathrion18.github.io/mateshka/` y tocá **Compartir → Agregar a pantalla de inicio**.

Los datos se guardan en el celu. Usá **Biblioteca → Copia de seguridad** para no perderlos.

© 2026 Ignacio Dubois. Todos los derechos reservados. El contenido de los libros citados pertenece a sus autores y editoriales.

## Traductor, repaso por páginas e IA

- `js/traductor.js`: botón «ЯA» arriba y tocar cualquier palabra rusa. Busca en el vocabulario de la app y en `js/formas.json` (cada forma del libro A2 → su palabra base, qué forma es y su traducción).
- `js/paginas.js`: repasar por páginas (desde / hasta), juego mezclado y pendientes en Inicio.
- `js/formas.json` se arma leyendo el PDF escaneado del A2 página por página (OCR) y cruzándolo con el vocabulario de la app.
- IA: `worker/worker.js` es el Worker de Cloudflare que habla con Gemini. La clave va como secreto `GEMINI_KEY` en Cloudflare. Cuando esté publicado, su dirección va en `IA_URL` de `js/ia.js`.
