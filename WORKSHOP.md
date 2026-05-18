# Taller: Documentar una API REST con Mintlify

> **Página padre del taller en Notion.** Cada "Paso N" se convierte en una subpágina. Los bloques de código están listos para copiar y pegar.
>
> La **introducción teórica** (qué es Mintlify, por qué, comparativa) se da en vivo antes de arrancar — no está escrita aquí.

## Punto de partida y objetivo

- **Kit inicial:** carpeta `Practica_Sin_Mintlify/` (API + Docker + Swagger + CORS + scripts listos)
- **Objetivo:** construir la carpeta `docs/` desde **una carpeta vacía**, archivo por archivo
- **Importante:** **NO** usamos el scaffold del CLI de Mintlify (no descargamos del repo de Mintlify). Creamos todo desde cero.

## Setup inicial (antes del Paso 1)

```bash
cd Practica_Sin_Mintlify
npm install
docker compose up --build
```

En otra terminal:

```bash
curl http://localhost:4040/health
```

Si responde `{"success":true, ...}` → todo OK, arrancamos.

---

## Índice

| # | Paso | Duración |
|---|---|---|
| 1 | [Estructura base de Mintlify](#paso-1) | 10 min |
| 2 | [Páginas conceptuales](#paso-2) | 25 min |
| 3 | [GET de Autores](#paso-3) | 8 min |
| 4 | [GET de Libros](#paso-4) | 8 min |
| 5 | [Playground con OpenAPI](#paso-5) | 15 min |
| 6 | [Fix del proxy](#paso-6) | 10 min |
| 6.5 | [Múltiples baseUrls](#paso-65) | 8 min |
| 7 | [Deploy a Mintlify Cloud](#paso-7) | 20 min |
| 7.5 | [(Opcional) Cloudflare Tunnel](#paso-75) | 15 min |

---

<a id="paso-1"></a>
## Paso 1 — Estructura base de Mintlify

### 1.1 Instalar el CLI

```bash
npm i -g mint
```

> ⚠️ **Importante:** cuando arranquemos `mint dev` por primera vez, el CLI puede ofrecer "scaffold a starter project" (Plant Store). **Decir que NO**. Vamos a crear todo manualmente.

### 1.2 Crear la carpeta `docs/` vacía

```bash
mkdir docs
cd docs
```

### 1.3 Crear `docs/mint.json`

```json
{
  "$schema": "https://mintlify.com/schema.json",
  "name": "Librería API",
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "#0F766E",
    "light": "#14B8A6",
    "dark": "#115E59"
  },
  "navigation": [
    {
      "group": "Inicio",
      "pages": ["introduction"]
    }
  ]
}
```

### 1.4 Crear `docs/favicon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0F766E">
  <path d="M19 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 18H6V4h12v16zM8 7h8v1H8V7zm0 3h8v1H8v-1zm0 3h5v1H8v-1z"/>
</svg>
```

### 1.5 Crear `docs/introduction.mdx`

```mdx
---
title: "Introducción"
description: "Descripción general de la API REST de Librería"
---

# Librería API

API REST construida con **Node.js**, **Express**, **Sequelize** y **PostgreSQL**, empaquetada con **Docker Compose** y documentada con **Swagger/OpenAPI**.

Permite gestionar dos entidades:

- **Autores**: personas que escriben libros.
- **Libros**: obras catalogadas, cada una asociada a un autor.

<Card title="Base URL" icon="globe">
  `http://localhost:4040`
</Card>
```

### 1.6 Crear `docs/index.mdx`

```mdx
---
title: "Librería API"
description: "Documentación del proyecto"
icon: "book"
---

<CardGroup cols={2}>
  <Card title="Introducción" icon="circle-info" href="/introduction">
    Visión general del proyecto y el stack.
  </Card>
  <Card title="Quickstart" icon="rocket" href="/quickstart">
    Levanta el proyecto en menos de 5 minutos.
  </Card>
</CardGroup>
```

### 1.7 Arrancar el preview

Desde dentro de `docs/`:

```bash
mint dev --port 3000
```

Si el CLI pregunta por scaffold → **No**.

Abrí `http://localhost:3000`.

**Verificación:** ves la home con los colores configurados y un link a Introduction.

---

<a id="paso-2"></a>
## Paso 2 — Páginas conceptuales

### 2.1 Crear `docs/quickstart.mdx`

````mdx
---
title: "Quickstart"
description: "Levanta la API en local con Docker Compose"
icon: "rocket"
---

## Requisitos

- Docker Desktop o Docker Engine + Compose v2

## Pasos

```bash
docker compose up --build
```

Cuando veas `API escuchando en puerto 4040`, prueba:

```bash
curl http://localhost:4040/health
```

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PORT` | `4040` | Puerto HTTP de Express |
| `DB_HOST` | `db` | Hostname del contenedor de Postgres |
| `DB_PORT` | `5432` | Puerto interno de Postgres |
| `DB_USER` | `postgres` | Usuario de la BD |
| `DB_PASSWORD` | `postgres` | Contraseña |
| `DB_NAME` | `libreria` | Nombre de la BD |

## Acceso a Swagger UI

- Swagger UI interactivo: `http://localhost:4040/api-docs`
- OpenAPI JSON: `http://localhost:4040/api-docs.json`
````

### 2.2 Crear `docs/models.mdx`

````mdx
---
title: "Modelos de datos"
description: "Modelos Sequelize: Autor, Libro y su relación"
icon: "database"
---

## Autor

Tabla SQL: `autores`.

| Campo | Tipo | Null | Notas |
|---|---|---|---|
| `id` | `INTEGER` | NO | PK autoincremental |
| `nombre` | `VARCHAR(150)` | NO | Obligatorio |
| `biografia` | `TEXT` | SÍ | Opcional |
| `created_at` | `TIMESTAMPTZ` | NO | Default `NOW()` |

## Libro

Tabla SQL: `libros`.

| Campo | Tipo | Null | Notas |
|---|---|---|---|
| `id` | `INTEGER` | NO | PK autoincremental |
| `titulo` | `VARCHAR(200)` | NO | Obligatorio |
| `isbn` | `VARCHAR(50)` | NO | **UNIQUE** |
| `genero` | `VARCHAR(100)` | NO | Filtrable case-insensitive |
| `anio_publicacion` | `INTEGER` | SÍ | Opcional |
| `autor_id` | `INTEGER` | NO | **FK** → `autores.id` (RESTRICT) |
| `created_at` | `TIMESTAMPTZ` | NO | Default `NOW()` |

## Relación

Un autor tiene **muchos** libros; un libro pertenece a **un** autor.

```js
Autor.hasMany(Libro, { foreignKey: "autor_id", as: "libros", onDelete: "RESTRICT" });
Libro.belongsTo(Autor, { foreignKey: "autor_id", as: "autor" });
```

<Warning>
  Con `onDelete: RESTRICT` no se puede eliminar un autor con libros. Primero borra (o reasigna) sus libros.
</Warning>
````

### 2.3 Crear `docs/errores.mdx`

````mdx
---
title: "Manejo de errores"
description: "Estructura estándar de errores y códigos"
icon: "triangle-exclamation"
---

## Estructura

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo"
  }
}
```

<Tip>
  Compara siempre `error.code` (estable), nunca `error.message` (puede cambiar).
</Tip>

## Códigos HTTP que maneja la API

| Status | Significado |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Body/parámetros inválidos o conflicto de negocio (FK, UNIQUE) |
| `404` | Recurso no existe o ruta no registrada |
| `500` | Error interno inesperado |

## Catálogo de `error.code`

| `error.code` | HTTP | Causa |
|---|---|---|
| `INVALID_ID` | 400 | `id` no es entero positivo |
| `INVALID_BODY` | 400 | Body con campos faltantes o tipos incorrectos |
| `AUTOR_NOT_FOUND` | 404 / 400 | Autor inexistente |
| `AUTOR_HAS_BOOKS` | 400 | Eliminar autor con libros (FK RESTRICT) |
| `LIBRO_NOT_FOUND` | 404 | Libro inexistente |
| `ISBN_DUPLICATE` | 400 | ISBN ya existe (UNIQUE) |
| `ROUTE_NOT_FOUND` | 404 | Ruta no registrada |
| `*_ERROR` | 500 | Error interno |
````

### 2.4 Crear `docs/docker.mdx`

````mdx
---
title: "Configuración Docker"
description: "Servicios, puertos, volúmenes y healthchecks del proyecto"
icon: "docker"
---

## Servicios

### `db` — PostgreSQL 16

- Imagen `postgres:16-alpine`
- Volumen `postgres_data` para persistencia
- Healthcheck combinado: `pg_isready` + `SELECT 1` real sobre la base `libreria`

### `api` — Node.js + Express

- Build desde `Dockerfile` local
- Puerto `4040:4040` mapeado al host
- `depends_on: db` con `condition: service_healthy`
- Healthcheck propio: `GET /health`

## Variables de entorno (servicio `api`)

| Variable | Valor |
|---|---|
| `PORT` | `4040` |
| `DB_HOST` | `db` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | `postgres` |
| `DB_NAME` | `libreria` |

## Comandos útiles

<AccordionGroup>
  <Accordion icon="play" title="Levantar todo">
    ```bash
    docker compose up --build
    ```
  </Accordion>
  <Accordion icon="circle-stop" title="Detener (conservar datos)">
    ```bash
    docker compose down
    ```
  </Accordion>
  <Accordion icon="broom" title="Detener y borrar la base">
    ```bash
    docker compose down -v
    ```
  </Accordion>
</AccordionGroup>

<Note>
  Las tablas las crea la API misma con `sequelize.sync({ alter: true })` al arrancar — no Postgres.
</Note>
````

### 2.5 Actualizar `docs/mint.json`

Reemplazá el bloque `navigation` por:

```json
"navigation": [
  {
    "group": "Inicio",
    "pages": ["introduction", "quickstart"]
  },
  {
    "group": "Guías",
    "pages": ["models", "errores", "docker"]
  }
]
```

**Verificación:** sidebar muestra dos grupos. Las 5 páginas (intro, quickstart, models, errores, docker) renderizan.

---

<a id="paso-3"></a>
## Paso 3 — GET de Autores

### 3.1 Crear `docs/api-reference/autores/list.mdx`

````mdx
---
title: "Listar autores"
description: "Devuelve todos los autores registrados"
api: "GET /autores"
---

Recupera la lista completa de autores, ordenada por `id` ascendente. No recibe parámetros.

## Ejemplos de request

<CodeGroup>

```bash cURL
curl http://localhost:4040/autores
```

```javascript fetch
const res = await fetch("http://localhost:4040/autores");
const json = await res.json();
console.log(json.data);
```

</CodeGroup>

## Respuesta exitosa

<ResponseField name="success" type="boolean" required />
<ResponseField name="data" type="Autor[]" required>
  <Expandable title="Estructura de Autor">
    <ResponseField name="id" type="integer" />
    <ResponseField name="nombre" type="string" />
    <ResponseField name="biografia" type="string | null" />
    <ResponseField name="created_at" type="string (ISO 8601)" />
  </Expandable>
</ResponseField>

<ResponseExample>

```json 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Gabriel Garcia Marquez",
      "biografia": "Novelista colombiano.",
      "created_at": "2026-05-09T18:00:00.000Z"
    }
  ]
}
```

</ResponseExample>

## Errores

| Status | `error.code` | Causa |
|---|---|---|
| 500 | `AUTORES_LIST_ERROR` | Error interno al consultar |
````

### 3.2 Actualizar `docs/mint.json`

Añadí al array `navigation`:

```json
{
  "group": "API Reference",
  "pages": ["api-reference/autores/list"]
}
```

**Verificación:** página "Listar autores" aparece bajo "API Reference".

---

<a id="paso-4"></a>
## Paso 4 — GET de Libros

### 4.1 Crear `docs/api-reference/libros/list.mdx`

````mdx
---
title: "Listar libros"
description: "Lista todos los libros con su autor, opcionalmente filtrado por género"
api: "GET /libros"
---

Cada libro viene con un objeto `autor` anidado (id + nombre).

## Query params

<ParamField query="genero" type="string">
  Filtra por género (case-insensitive, match exacto). Ejemplos: `ficcion`, `historia`, `ciencia ficcion`.
</ParamField>

## Ejemplos

<CodeGroup>

```bash cURL (todos)
curl http://localhost:4040/libros
```

```bash cURL (filtrado)
curl "http://localhost:4040/libros?genero=ficcion"
```

```javascript fetch
const params = new URLSearchParams({ genero: "ficcion" });
const res = await fetch(`http://localhost:4040/libros?${params}`);
```

</CodeGroup>

## Respuesta exitosa

<ResponseExample>

```json 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Cien anos de soledad",
      "isbn": "9780307474728",
      "genero": "ficcion",
      "anio_publicacion": 1967,
      "autor_id": 1,
      "autor": { "id": 1, "nombre": "Gabriel Garcia Marquez" }
    }
  ]
}
```

</ResponseExample>

## Errores

| Status | `error.code` |
|---|---|
| 500 | `LIBROS_LIST_ERROR` |
````

### 4.2 Actualizar `docs/mint.json`

Añadí la página al grupo "API Reference" existente:

```json
{
  "group": "API Reference",
  "pages": [
    "api-reference/autores/list",
    "api-reference/libros/list"
  ]
}
```

**Verificación:** sidebar muestra ambos endpoints bajo "API Reference".

---

<a id="paso-5"></a>
## Paso 5 — Playground con OpenAPI

### 5.1 Ver el spec que Swagger ya genera

Con Docker arriba, abrí en el navegador:

- `http://localhost:4040/api-docs` — **Swagger UI** (interfaz interactiva)
- `http://localhost:4040/api-docs.json` — **JSON crudo** del spec OpenAPI

> *La API ya construye este JSON internamente con `swagger-jsdoc` leyendo los JSDoc de `src/routes/*.js`. Vamos a usar ese mismo JSON como fuente del playground de Mintlify.*

### 5.2 Copiar el spec a `docs/openapi.json`

1. Abrí `http://localhost:4040/api-docs.json` en el navegador
2. **Ctrl+A** (seleccionar todo) → **Ctrl+C** (copiar)
3. Creá un archivo nuevo `docs/openapi.json` y pegá el contenido
4. Guardá

<Tip>
  **Para sus proyectos reales:** el kit ya trae `scripts/export-openapi.js` + el comando `npm run docs:openapi` que hace exactamente lo mismo sin abrir el navegador, y se ejecuta solo antes de `npm start` gracias al hook `prestart`. Hoy lo hicimos manual para ver visualmente la conexión.
</Tip>

### 5.3 Actualizar `docs/mint.json`

Añadí dos campos a la raíz (junto a `name`, `colors`, `navigation`):

```json
"openapi": ["openapi.json"],
"api": {
  "baseUrl": "http://localhost:4040",
  "playground": {
    "mode": "show"
  }
}
```

### 5.4 Cambiar `api:` por `openapi:` en los 2 frontmatters

En estos 2 archivos, cambiá `api: "GET /ruta"` → `openapi: "GET /ruta"`:

- `docs/api-reference/autores/list.mdx`
- `docs/api-reference/libros/list.mdx`

```diff
- api: "GET /autores"
+ openapi: "GET /autores"
```

**Verificación:** en cualquier página de endpoint aparece el panel del playground a la derecha con un botón **Send**.

---

<a id="paso-6"></a>
## Paso 6 — Fix del proxy de Mintlify

### 6.1 Disparar el error

En una página de endpoint, dar **Send** sin tocar nada.

**Resultado esperado:**

```json
{ "error": true, "errorMessage": "invalid URL" }
```

### 6.2 Explicar el problema

> *Por defecto, Mintlify rutea las requests del playground a través de **su proxy cloud**. Ese proxy intenta resolver `http://localhost:4040` desde **sus servidores**, no desde tu máquina. Por eso falla.*

### 6.3 Aplicar el fix

En `docs/mint.json`, dentro del bloque `api.playground`, añadí `disableProxy: true`:

```json
"playground": {
  "mode": "show",
  "disableProxy": true
}
```

Refrescá y volvé a dar **Send**.

**Verificación:** ahora la request va directo del navegador a `localhost:4040` y ves la respuesta JSON real bajo el botón.

---

<a id="paso-65"></a>
## Paso 6.5 — Múltiples baseUrls (dropdown en el playground)

**Objetivo:** que el playground muestre un selector para elegir entre diferentes entornos (local, túnel, producción).

### 6.5.1 Cambiar `baseUrl` de string a array

En `docs/mint.json`, dentro del bloque `api`, reemplazá:

```diff
- "baseUrl": "http://localhost:4040",
+ "baseUrl": [
+   "http://localhost:4040",
+   "https://placeholder.trycloudflare.com"
+ ],
```

### 6.5.2 Verificación

Refrescá. En el playground de cualquier endpoint, ahora aparece un **dropdown sobre el botón Send** con las dos URLs. La primera es la activa por defecto.

<Tip>
  La segunda URL (`placeholder.trycloudflare.com`) es un placeholder. La reemplazaremos en el Paso 7.5 cuando tengamos la URL real del túnel.
</Tip>

### 6.5.3 Por qué esto importa

- En local: usás `localhost:4040`
- Cuando desplegues el sitio a Mintlify Cloud, el visitante puede elegir si pegarle a su localhost o a tu túnel público
- Si en el futuro tenés un staging o producción, agregás más URLs al array

---

<a id="paso-7"></a>
## Paso 7 — Deploy a Mintlify Cloud

### 7.1 Subir a GitHub

```bash
git init
git add .
git commit -m "Workshop: docs en Mintlify"
gh repo create libreria-api-docs --public --source=. --remote=origin --push
```

Si no tenés `gh`, creá el repo desde la UI de GitHub y hacé `git push`.

### 7.2 Conectar Mintlify

1. Cuenta en https://mintlify.com
2. Dashboard → Settings → GitHub App → instalar en tu repo
3. Connect repository → especificar que la carpeta de docs es `docs/`
4. Primer deploy automático en `<tu-org>.mintlify.app`

### 7.3 Verificación

Abrí `https://<tu-org>.mintlify.app`. Cada `git push origin main` redeploys.

---

<a id="paso-75"></a>
## Paso 7.5 (opcional) — Cloudflare Tunnel + actualizar baseUrl

> Este paso es **independiente** del Paso 6. El Paso 6 trataba del *proxy de Mintlify*. Este trata del *Cloudflare Tunnel* (cómo el mundo llega a tu API local).

### 7.5.1 Instalar cloudflared

https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

### 7.5.2 Abrir túnel temporal

Con Docker corriendo:

```bash
cloudflared tunnel --url http://localhost:4040
```

Salida (anotá la URL pública):

```
Your quick Tunnel has been created! Visit it at:
https://xxx-xxx-xxx.trycloudflare.com
```

### 7.5.3 Reemplazar el placeholder en `mint.json`

Cambiá `https://placeholder.trycloudflare.com` por la URL real:

```json
"baseUrl": [
  "http://localhost:4040",
  "https://xxx-xxx-xxx.trycloudflare.com"
],
```

### 7.5.4 Push y verificar

```bash
git add docs/mint.json
git commit -m "Apuntar baseUrl al tunnel"
git push
```

Esperá el redeploy de Mintlify. Desde otro dispositivo, abrí el sitio público, elegí la URL del túnel en el dropdown del playground, y dale Send → la request va por el túnel hasta tu Docker local.

<Warning>
  La URL del túnel temporal **cambia cada vez** que reinicies `cloudflared`. Para una URL fija, usá `cloudflared tunnel create <nombre>` (requiere cuenta de Cloudflare).
</Warning>

---

## Cierre

Al terminar:

- ✅ Sitio Mintlify con páginas conceptuales + 2 endpoints (GET autores y GET libros)
- ✅ Playground interactivo conectado al Swagger real del backend
- ✅ Dropdown con múltiples baseUrls en el playground
- ✅ Deploy continuo desde GitHub
- ✅ (Opcional) Playground público vía Cloudflare Tunnel

### Próximos pasos sugeridos para los alumnos

- Documentar GETs por ID, POST, PUT y DELETE siguiendo el mismo patrón
- Añadir página de Relación Autor↔Libro
- Añadir autenticación (Bearer) y reflejarla en el spec
- Migrar a `docs.json` (formato nuevo de Mintlify)

---

## Para el instructor

- Esta página padre tiene el índice; cada Paso N va como subpágina de Notion.
- La intro teórica ("qué es Mintlify") se da en vivo antes del Paso 1.
- El kit `Practica_Sin_Mintlify/` ya trae: puerto 4040, CORS, `scripts/export-openapi.js`, npm scripts, healthchecks robustos, Dockerfile ajustado.
- **Cuando `mint dev` ofrezca scaffold del Plant Store → siempre decir NO**. Si lo aceptan, baja toda la basura del starter y aparecen warnings molestos.
- Tiempo total estimado: **~1h 50min** sin opcional, **~2h** con Cloudflare.
