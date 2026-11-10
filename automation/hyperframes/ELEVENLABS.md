# Activación de narración dominicana

Este cambio requiere `ELEVENLABS_API_KEY` en los secretos de GitHub Actions y un plan de ElevenLabs que permita uso comercial y voces de biblioteca por API. No incorporar una clave al repositorio.

Voz propuesta: Ramses (`RkTY0BBMA1oYqRLj7BnR`), español dominicano de biblioteca. Modelo: `eleven_multilingual_v2`. Revisar una escucha privada antes de publicar el primer video con la nueva voz.

El 10 de noviembre de 2026 la cuenta disponible estaba en Free. La API respondió HTTP 402 `paid_plan_required` al solicitar esta voz. No se generó audio dominicano. No fusionar el cambio de workflow hasta resolver el acceso y revisar una muestra completa.

El cliente guarda caché sin credenciales, valida la alineación exacta del guion y detiene la publicación ante errores. No cambia silenciosamente a otra voz. La duración del video depende de la narración completa; no recortarla ni acelerarla.

La muestra visual de El Valle utiliza sonido ambiente de la grabación original y no contiene una voz sintética.
