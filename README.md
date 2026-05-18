# API REST Libreria (Node.js + Express + PostgreSQL + Docker)

## Levantar todo con Docker Compose

```bash
docker-compose up --build
```

La API queda en `http://localhost:4040`.

## Inicializacion automatica de tablas

La API usa Sequelize con `sync()` al iniciar, por lo que crea las tablas automaticamente sin migraciones manuales ni `init.sql`.

Ademas, se ejecuta un seed automatico (`src/config/seed.js`) solo si las tablas estan vacias, cargando autores y libros de prueba.

Si quieres forzar una reinicializacion desde cero:

```bash
docker-compose down -v
docker-compose up --build
```

## Endpoints

### Autores

- `GET /autores`
- `GET /autores/:id`
- `POST /autores`
- `PUT /autores/:id`
- `DELETE /autores/:id`

Ejemplo `POST /autores`:

```json
{
  "nombre": "Gabriel Garcia Marquez",
  "biografia": "Autor colombiano"
}
```

### Libros

- `GET /libros`
- `GET /libros?genero=ficcion`
- `GET /libros/:id`
- `POST /libros`
- `PUT /libros/:id`
- `DELETE /libros/:id`

Ejemplo `POST /libros`:

```json
{
  "titulo": "Cien anos de soledad",
  "isbn": "9780307474728",
  "genero": "ficcion",
  "anio_publicacion": 1967,
  "autor_id": 1
}
```

## Relacion entre entidades

- Un autor tiene muchos libros.
- Cada libro pertenece a un autor (`libros.autor_id -> autores.id`).
