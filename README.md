# Campeach — No More ManyChat

Sitio oficial de campamentos y equipos de camping de Campeach RD, junto con la lógica segura para responder consultas de Instagram sin depender de ManyChat.

## Desarrollo

```bash
npm ci
npm run dev
```

## Validación

```bash
npm test
npm run build
```

Cada cambio enviado a `main` se prueba, compila y publica mediante GitHub Actions. GitHub Pages aloja el catálogo estático; el webhook de Instagram se desplegará por separado porque necesita un proceso HTTP activo y secretos privados.

Las claves de Meta y OpenAI nunca deben guardarse en el repositorio.
