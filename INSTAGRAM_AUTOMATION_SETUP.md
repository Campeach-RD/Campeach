# Automatización de Instagram de Campeach

El endpoint definitivo de Meta se configurará al desplegar el Worker HTTP conectado a este repositorio.

## Variables privadas del Worker

Configura estas variables como secretos del servicio que ejecute el Worker. Nunca las guardes en Git ni las pegues en archivos públicos.

- `OPENAI_API_KEY`: clave de la API de OpenAI.
- `OPENAI_MODEL`: `gpt-5.6-luna` (opcional; es el valor predeterminado de bajo costo).
- `META_APP_SECRET`: secreto de la aplicación de Meta.
- `META_WEBHOOK_VERIFY_TOKEN`: frase aleatoria larga elegida por Campeach.
- `META_GRAPH_API_VERSION`: versión activa indicada en Meta Developers, incluyendo la `v`.
- `INSTAGRAM_ACCOUNT_ID`: ID de la cuenta profesional de Instagram.
- `INSTAGRAM_ACCESS_TOKEN`: token con permiso `instagram_business_manage_messages`.

## Configuración en Meta Developers

1. Crea o abre la aplicación Business de Campeach y añade Instagram.
2. Conecta la cuenta profesional `@campeachrd` mediante Instagram Login.
3. Solicita `instagram_business_basic` e `instagram_business_manage_messages`.
4. En Webhooks, registra la URL indicada arriba y el mismo valor de `META_WEBHOOK_VERIFY_TOKEN`.
5. Suscribe como mínimo el campo `messages` de la cuenta de Instagram.
6. Pon la aplicación en modo Live cuando las pruebas con usuarios de la aplicación funcionen.

## Prueba de aceptación

Desde otra cuenta de Instagram, envía estos mensajes y comprueba el resultado:

- `Hola` → enlace al catálogo general.
- `Quiero información de Villa Altagracia` → resumen y enlace directo al campamento.
- `¿Cuánto cuesta la Carpa No. 4?` → precio, detalle y enlace directo al equipo.
- `Busco un campamento con río` → selección del catálogo o enlace general seguro.

El bot ignora eventos enviados por sí mismo, valida la firma de Meta y solo publica precios e información que ya existen en el catálogo local. Si OpenAI no está disponible o una consulta no coincide claramente, dirige al catálogo general.
