# Narración de Campeach con ElevenLabs

Voz propuesta: Laura (`FGY2WhTYpPnrIDTdsKH5`), voz estándar multilingüe. Modelo `eleven_multilingual_v2`, `language_code=es`, tono narrativo cercano. La usuaria aceptó español latinoamericano en lugar de exigir acento dominicano. No afirmar que es una locutora nativa dominicana.

La prueba de la API funcionó el 10 de noviembre de 2026: narración completa de El Valle, 28.26 segundos, seis segmentos alineados por caracteres. La muestra privada elimina todo el audio del metraje original; contiene únicamente la narración. Los videos de la composición siempre deben estar silenciados.

La cuenta continúa en Free. La voz estándar funciona para pruebas privadas; el uso comercial requiere habilitar un plan compatible y regenerar el audio bajo esa licencia. No reutilizar comercialmente el audio creado bajo Free. La voz de biblioteca y Voice Design por API estaban bloqueados por el plan; no usar esas opciones como alternativa automática.

Antes de activar #7: configurar `ELEVENLABS_API_KEY` como secreto de GitHub Actions, resolver la licencia comercial y comprobar una muestra regenerada. No guardar claves en el código. El cliente bloquea producción en Free, valida la alineación completa, conserva una caché sin credenciales y detiene la publicación ante errores; no cambia a otra voz ni al audio original.

## Programación solicitada

Un reel nuevo diario, todos los días a las 11:00 a. m. de Santo Domingo. Se reemplaza el cron anterior de cuatro días, conservando un único workflow de reels. Los carruseles mantienen su programación independiente. No hay trabajos antiguos de reels en cola, en ejecución ni esperando aprobación al comprobarlo el 10 de noviembre de 2026. La campaña Bosque conserva sus crons desactivados.

La clave ya quedó guardada en los secretos cifrados de GitHub Actions. El workflow hace una comprobación antes de descargar metraje y vuelve a verificar el plan antes de narrar, incluso si existe caché. En Free no genera ni publica promociones. Activar la licencia comercial en la cuenta existente resuelve ese bloqueo sin cambiar la clave.
