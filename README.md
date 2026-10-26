# Biblioteca — seguimiento de libros

**Dominio:** C — Biblioteca
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** carpetas por tipo de archivo

## Integrantes

- Gonzalo Benitez — GitHub: `Gb020207`
- Agustin Rolon — agregar usuario de GitHub

## Descripción

Aplicación web para administrar libros y sus estados, permitir que usuarios sigan libros y notificarles cuando cambia su disponibilidad. Incluye autenticación, permisos por rol, una interfaz web y una API REST.

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

Compose levanta PostgreSQL, la API y la aplicación React. El backend espera a que la base de datos pase su healthcheck, crea las tablas y carga los roles, permisos y usuarios de prueba automáticamente.

- Frontend: <http://localhost:5173>
- API: <http://localhost:3000>
- Estado de la API: <http://localhost:3000/health>

Para detener los servicios:

```powershell
docker compose down
```

Los datos persisten en el volumen `postgres_data`. Para eliminar también la base persistida en un entorno de desarrollo, ejecutar `docker compose down -v`.

> Las credenciales incluidas en `.env.example` son exclusivamente para desarrollo local. Cambiá las contraseñas y `JWT_SECRET` antes de desplegar el proyecto en un entorno compartido o público. No publiques el archivo `.env`.

## Ejecución local sin Docker

La base de datos sigue ejecutándose en Docker. Desde la raíz:

```powershell
docker compose up -d db
```

En una terminal, desde `backend/`:

```powershell
npm ci
$env:DB_HOST = "localhost"
npm run dev
```

En otra terminal, desde `frontend/`:

```powershell
npm ci
$env:VITE_API_URL = "http://localhost:3000/api"
npm run dev
```

Vite informa la dirección local al iniciar (por defecto, <http://localhost:5173>). Para compilar el backend, ejecutar `npm run build` y luego `npm start` desde `backend/`; para compilar el frontend, ejecutar `npm run build` desde `frontend/`.

## Variables de entorno

| Variable | Descripción | Ejemplo de desarrollo |
|---|---|---|
| `DB_HOST` | Host PostgreSQL (Compose lo reemplaza por `db`) | `db` |
| `DB_PORT` | Puerto PostgreSQL publicado | `5432` |
| `DB_USER` | Usuario PostgreSQL | `biblioteca` |
| `DB_PASSWORD` | Contraseña PostgreSQL | `cambiar-esta-clave` |
| `DB_NAME` | Nombre de la base | `biblioteca` |
| `JWT_SECRET` | Secreto para firmar tokens | Reemplazar por uno aleatorio |
| `API_PORT` | Puerto publicado para la API | `3000` |
| `FRONTEND_PORT` | Puerto publicado para la aplicación web | `5173` |
| `VITE_API_URL` | URL de la API para el frontend local | `http://localhost:3000/api` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Usuario de prueba administrador | `admin@tp.com` |
| `SEED_OPERATOR_EMAIL` / `SEED_OPERATOR_PASSWORD` | Usuario de prueba operador | `operador@tp.com` |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | Usuario de prueba común | `usuario@tp.com` |

Los tres usuarios de prueba se crean al arrancar si todavía no existen. Las contraseñas se guardan con bcrypt. El seed sincroniza los roles de esas cuentas con los roles de prueba configurados en el entorno y carga libros de ejemplo si todavía no existen.

## Usuarios de prueba

Con los valores iniciales de `.env.example`:

| Rol | Email | Contraseña |
|---|---|---|
| admin | `admin@tp.com` | `Admin123!` |
| operador | `operador@tp.com` | `Operador123!` |
| usuario | `usuario@tp.com` | `Usuario123!` |

## Endpoints principales

Las rutas protegidas requieren el encabezado `Authorization: Bearer <token>`. El registro y el inicio de sesión devuelven un token JWT y los datos públicos del usuario junto con sus permisos.

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
| `GET` | `/api/subscriptions/books/:bookId` | `subscription:create` |
| `POST` | `/api/subscriptions/books/:bookId` | `subscription:create` |
| `DELETE` | `/api/subscriptions/books/:bookId` | `subscription:delete` |
| `GET` | `/api/notifications` | `notification:read` |
| `GET` | `/api/notifications/unread-count` | `notification:read` |
| `PATCH` | `/api/notifications/:id/read` | `notification:read` |
| `GET` | `/api/users` | `user:read` |
| `GET` | `/api/users/roles` | `user:read` |
| `PATCH` | `/api/users/:id/role` | `user:assign-role` |

El cuerpo para crear o editar un libro es `{"title":"Título","description":"Descripción"}`. Para cambiar el estado: `{"status":"PRESTADO"}`; los valores admitidos son `DISPONIBLE`, `PRESTADO` y `EN_REPARACION`. Para asignar un rol: `{"roleId":1}` (los roles disponibles se cargan al iniciar).

## Cómo probar el flujo de notificaciones

1. Ingresar al frontend como `usuario@tp.com` con la contraseña `Usuario123!` y seguir un libro.
2. En otra ventana o perfil, ingresar como `operador@tp.com` con la contraseña `Operador123!` y cambiar el estado de ese libro.
3. Volver a la sesión de `usuario`: el contador se actualiza por polling y el aviso aparece en la bandeja de notificaciones. Desde ahí se puede marcar como leído.
4. Verificar la salida del adaptador de consola:

   ```powershell
   docker compose logs -f backend
   ```

## Patrones y principios SOLID

La ubicación, el propósito y ejemplos de los patrones y principios SOLID se documentan en [PATTERNS.md](./PATTERNS.md).
