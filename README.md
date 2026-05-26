# Sprint 09 · Live 2 — Prisma, ORM y CRUD Real con Supabase

> **Objetivo de la Clase**
> Conectar el backend de Express a la base de datos de Supabase usando Prisma como ORM.
> Implementar el CRUD completo con datos reales e introducir middlewares básicos.

---

## 🎒 Antes de Empezar

Verifica que tienes:

- [ ] El proyecto de la clase anterior (`08 LIVE 2`) funcionando con el array de datos.
- [ ] El proyecto de Supabase activo con las tablas `movies` y `users` creadas.
- [ ] La URL de conexión a Supabase (la necesitarás en el Bloque 2).

**¿Dónde encuentro la URL de conexión en Supabase?**

```
Supabase → Tu Proyecto → Project Settings → Database → Connection String
```

Copia la opción **URI** (empieza por `postgresql://`).

---

## 📂 Estructura del Proyecto

```
09-live-2/
├── .env                    # Credenciales (NO subir a GitHub)
├── .env.example            # Plantilla de variables (SÍ subir)
├── .gitignore
├── package.json
│
├── prisma/
│   └── schema.prisma       # Definición de los modelos (tablas)
│
└── src/
    ├── server.js
    ├── app.js
    ├── lib/
    │   └── prisma.js       # Cliente de Prisma (instancia única)
    ├── routes/
    │   └── movies.routes.js
    ├── controllers/
    │   └── movies.controller.js
    ├── services/
    │   └── movies.service.js
    └── middlewares/
        ├── errorHandler.js
        ├── notFound.js
        └── validateMovie.js
```

---

## Bloque 1 · Teoría (20 min)

### 1.1 El problema con el array

En la clase anterior, los datos vivían en un array en memoria:

```js
// movies.js
export let movies = [{ id: 1, title: "Matrix" }]
```

Problema: al reiniciar el servidor, esos cambios **desaparecen**.
Solución: guardar los datos en la base de datos de Supabase que creamos en el Live 1.

---

### 1.2 ¿Qué es un ORM?

Un ORM (Object-Relational Mapper) traduce código JavaScript a SQL automáticamente.

| Sin ORM (SQL manual)            | Con Prisma (ORM)                            |
| :------------------------------ | :------------------------------------------ |
| `SELECT * FROM movies`          | `prisma.movie.findMany()`                   |
| `INSERT INTO movies ...`        | `prisma.movie.create({ data: {...} })`      |
| `DELETE FROM movies WHERE id=1` | `prisma.movie.delete({ where: { id: 1 } })` |

Ventajas:

- Menos posibilidades de error de sintaxis SQL.
- Autocompletado en el editor.
- Más fácil de leer y mantener.

---

### 1.3 ¿Qué son las Variables de Entorno?

Son valores de configuración que **no queremos escribir directamente en el código**, porque:

- Son sensibles (contraseñas, claves de API).
- Cambian entre entornos (desarrollo, producción).

Se guardan en un archivo `.env` que **nunca se sube a GitHub**.

```
# .env
DATABASE_URL="postgresql://..."
PORT=3000
```

```js
// Acceder desde el código
process.env.PORT // → "3000"
process.env.DATABASE_URL // → "postgresql://..."
```

---

## Bloque 2 · Configurar `.env` y Prisma (10 min)

### Paso 1: Instalar dependencias

```bash
npm install
npm install prisma --save-dev
npm install @prisma/client
```

### Paso 2: Inicializar Prisma

```bash
npx prisma init
```

Esto crea automáticamente:

- `prisma/schema.prisma`
- `.env` (con un `DATABASE_URL` de ejemplo)

### Paso 3: Añadir la URL de Supabase al `.env`

Abre `.env` y reemplaza el valor de ejemplo con tu URL real de Supabase:

```
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.XXXX.supabase.co:5432/postgres"
PORT=3000
NODE_ENV=development
```

> ⚠️ **Importante:** Verificar que `.env` está en el `.gitignore`. Nunca subir credenciales reales a GitHub.

---

## Bloque 3 · Definir el Modelo en `schema.prisma` (10 min)

Abre `prisma/schema.prisma`. Los **modelos** de Prisma representan las **tablas** que creamos en Supabase:

```prisma
model Movie {
  id        Int      @id @default(autoincrement())
  title     String
  director  String?
  year      Int?
  rating    Float?
  createdAt DateTime @default(now()) @map("created_at")

  @@map("movies")
}
```

**Puntos importantes:**

| Elemento                    | Qué significa                                                                           |
| :-------------------------- | :-------------------------------------------------------------------------------------- |
| `@id`                       | Esta es la clave primaria (equivale a `PRIMARY KEY`).                                   |
| `@default(autoincrement())` | El ID se genera automáticamente.                                                        |
| `String?`                   | El `?` significa que el campo es opcional (`NULL` en SQL).                              |
| `@map("created_at")`        | En JS usamos `createdAt` (camelCase), pero en la BBDD la columna se llama `created_at`. |
| `@@map("movies")`           | El modelo se llama `Movie` (singular), pero la tabla en BBDD se llama `movies`.         |

### Paso 4: Generar el Prisma Client

```bash
npx prisma generate
```

Esto genera el código necesario para hacer consultas desde Node.js.

> **Tip:** Cada vez que modifiques `schema.prisma`, debes ejecutar `npx prisma generate` de nuevo.

---

## Bloque 4 · Services con Prisma (20 min)

El cambio principal está en la capa `services`. Antes accedíamos a un array, ahora llamamos a Prisma:

| Antes (array)                           | Ahora (Prisma)                                 |
| :-------------------------------------- | :--------------------------------------------- |
| `movies`                                | `prisma.movie.findMany()`                      |
| `movies.find(m => m.id === id)`         | `prisma.movie.findUnique({ where: { id } })`   |
| `movies.push(data)`                     | `prisma.movie.create({ data })`                |
| `movies[i] = { ...movies[i], ...data }` | `prisma.movie.update({ where: { id }, data })` |
| `movies.splice(i, 1)`                   | `prisma.movie.delete({ where: { id } })`       |

---

## Bloque 5 · Middlewares (15 min)

Un middleware es una función que se ejecuta **entre la petición y la respuesta**.

```
Request → [notFound] → [errorHandler] → [validateMovie] → Controller → Response
```

### `notFound.js`

Se coloca **al final** de `app.js`, después de todas las rutas. Captura cualquier URL que no coincida.

### `validateMovie.js`

Se coloca **en la ruta POST** como middleware intermedio. Valida que el body contenga los campos obligatorios antes de llegar al controller.

### `errorHandler.js`

Se coloca **al final** de `app.js`, después del `notFound`. Captura cualquier error que se propague con `next(error)`.

**Ejemplo de cómo registrarlos en `app.js`:**

```js
// Rutas
app.use("/movies", moviesRouter)

// Middlewares de error (siempre al final)
app.use(notFound)
app.use(errorHandler)
```

---

## Bloque 6 · Probar con Postman (15 min)

Arranca el servidor:

```bash
npm run dev
```

Prueba los siguientes endpoints ordenados:

| Acción          | Método   | URL          | Body                                                                         |
| :-------------- | :------- | :----------- | :--------------------------------------------------------------------------- |
| Listar todas    | `GET`    | `/movies`    | —                                                                            |
| Obtener una     | `GET`    | `/movies/1`  | —                                                                            |
| Crear nueva     | `POST`   | `/movies`    | `{ "title": "Dune", "year": 2021, "director": "Villeneuve", "rating": 7.9 }` |
| Actualizar      | `PUT`    | `/movies/1`  | `{ "rating": 9.5 }`                                                          |
| Eliminar        | `DELETE` | `/movies/1`  | —                                                                            |
| URL inválida    | `GET`    | `/peliculas` | — → debe responder `404`                                                     |
| POST sin título | `POST`   | `/movies`    | `{ "year": 2021 }` → debe responder `400`                                    |

---

## ✅ Resumen Final

Hemos aprendido:

- [ ] Qué es un ORM y por qué usarlo.
- [ ] Qué es Prisma y cómo se configura.
- [ ] Cómo proteger credenciales con `.env`.
- [ ] Cómo conectar el backend a PostgreSQL (Supabase).
- [ ] Cómo definir modelos en `schema.prisma`.
- [ ] Cómo reemplazar el array de datos por consultas reales a la BBDD.
- [ ] Qué es un middleware y para qué sirve.
- [ ] Cómo manejar errores con `errorHandler` y rutas no existentes con `notFound`.

---
