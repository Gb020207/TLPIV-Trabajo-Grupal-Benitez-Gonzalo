# Biblioteca — seguimiento de libros

**Dominio:** C — Biblioteca
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** carpetas por tipo de archivo

## Integrantes

- Gonzalo Benitez
- Agustin Rolon

## Descripción

API para administrar libros y sus estados, permitir que usuarios sigan libros y notificar a cada suscriptor cuando cambia su estado. El backend aplica permisos por rol y guarda las notificaciones en PostgreSQL, además de registrarlas en la consola.

## Requisitos previos

- Docker Desktop con Docker Compose
- Git
- Node.js 22 o posterior (solo para desarrollo local)

## Cómo ejecutar con Docker

Desde la raíz del repositorio:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

El backend espera a que PostgreSQL pase su healthcheck, crea las tablas y carga los roles, permisos y usuarios de prueba al iniciar. La API queda disponible en `http://localhost:3000`; su verificación de salud es `http://localhost:3000/health`.

Para detener los servicios:

```powershell
docker compose down
```

Los datos persisten en el volumen `postgres_data`. Para eliminar también la base persistida en un entorno de desarrollo, ejecutar `docker compose down -v`.

> Las credenciales incluidas en `.env.example` son exclusivamente para desarrollo local. Cambiá las contraseñas y `JWT_SECRET` antes de desplegar el proyecto en un entorno compartido o público. No publiques el archivo `.env`.

## Ejecución local sin contenedores

La base de datos sigue ejecutándose en Docker. Desde la raíz:

```powershell
docker compose up -d db
```

En otra terminal, desde `backend/`:

```powershell
npm ci
$env:DB_HOST = "localhost"
npm run dev
```

Para compilar y ejecutar la versión compilada:

```powershell
npm run build
npm start
```

El frontend todavía no está implementado; por ahora el proyecto expone la API y la base de datos.

## Variables de entorno

| Variable | Descripción | Ejemplo de desarrollo |
|---|---|---|
| `DB_HOST` | Host PostgreSQL (Compose lo reemplaza por `db`) | `db` |
| `DB_PORT` | Puerto PostgreSQL publicado | `5432` |
| `DB_USER` | Usuario PostgreSQL | `biblioteca` |
| `DB_PASSWORD` | Contraseña PostgreSQL | `cambiar-esta-clave` |
| `DB_NAME` | Nombre de la base | `biblioteca` |
| `JWT_SECRET` | Secreto para firmar tokens | Reemplazar por uno aleatorio |
| `API_PORT` | Puerto HTTP del backend | `3000` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Usuario de prueba administrador | `admin@tp.com` |
| `SEED_OPERATOR_EMAIL` / `SEED_OPERATOR_PASSWORD` | Usuario de prueba operador | `operador@tp.com` |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | Usuario de prueba común | `usuario@tp.com` |

Los tres usuarios de prueba se crean al arrancar si todavía no existen. Las contraseñas se guardan con bcrypt. El seed sincroniza los roles de esas cuentas con los roles de prueba configurados en el entorno.

## Usuarios de prueba

Con los valores iniciales de `.env.example`:

| Rol | Email | Contraseña |
|---|---|---|
| admin | `admin@tp.com` | `Admin123!` |
| operador | `operador@tp.com` | `Operador123!` |
| usuario | `usuario@tp.com` | `Usuario123!` |

## Endpoints principales

Las rutas protegidas requieren `Authorization: Bearer <token>`. Las respuestas JSON de registro e inicio de sesión incluyen `token` y los datos públicos del usuario junto con sus permisos.

| Método | Ruta | Permiso |
|---|---|---|
| `GET` | `/health` | Público |
| `POST` | `/api/auth/register` | Público |
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/books` | `book:read` |
| `GET` | `/api/books/:id` | `book:read` |
| `POST` | `/api/books` | `book:create` |
| `PATCH` | `/api/books/:id` | `book:update` |
| `PATCH` | `/api/books/:id/status` | `book:change-status` |
| `DELETE` | `/api/books/:id` | `book:delete` |
| `POST` | `/api/subscriptions/books/:bookId` | `subscription:create` |
| `DELETE` | `/api/subscriptions/books/:bookId` | `subscription:delete` |
| `GET` | `/api/notifications` | `notification:read` |
| `GET` | `/api/notifications/unread-count` | `notification:read` |
| `PATCH` | `/api/notifications/:id/read` | `notification:read` |
| `GET` | `/api/users` | `user:read` |
| `PATCH` | `/api/users/:id/role` | `user:assign-role` |

El cuerpo para crear un libro es `{"title":"Título","description":"Descripción"}`. Para cambiar el estado: `{"status":"PRESTADO"}`; los valores admitidos son `DISPONIBLE`, `PRESTADO` y `EN_REPARACION`. Para asignar un rol: `{"roleId":1}` (los roles disponibles se cargan al iniciar).

## Flujo de notificaciones

1. Iniciar sesión como `usuario` y usar el token para suscribirse con `POST /api/subscriptions/books/:bookId`.
2. Cambiar el estado de ese libro como `operador` o `admin`.
3. Consultar `GET /api/notifications` como el usuario suscripto y, si corresponde, marcar la notificación con `PATCH /api/notifications/:id/read`.
4. Comprobar la línea emitida por el adaptador con:

   ```powershell
   docker compose logs -f backend
   ```

## Patrones y principios SOLID

La ubicación y el propósito de los patrones y principios SOLID se documentan en [PATTERNS.md](./PATTERNS.md).
