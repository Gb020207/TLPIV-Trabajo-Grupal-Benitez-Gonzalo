# Patrones de diseño y principios SOLID

Los ejemplos corresponden al dominio Biblioteca. Las rutas conectan controllers con servicios; los servicios dependen de interfaces de repositorio y estos encapsulan las operaciones Sequelize.

## Singleton — conexión PostgreSQL

**Archivos:** `backend/src/config/db.ts`, `backend/src/main.ts`.

`DatabaseConnection` mantiene el constructor privado y entrega una instancia compartida a través de `getInstance()`. El composition root usa esa instancia para conectar y sincronizar los modelos.

```ts
const database = DatabaseConnection.getInstance();
const sequelize = database.getConnection();
```

## Observer — eventos de cambio de estado

**Archivos:** `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts`, `backend/src/observer/EventPublisher.ts`, `backend/src/services/BookService.ts`, `backend/src/services/NotificationService.ts`, `backend/src/main.ts`.

`BookService` publica el evento después de persistir un cambio real de estado. `NotificationService`, registrado desde `main.ts`, consulta las suscripciones y procesa cada destinatario.

```ts
await this.books.update(book, { status });
await this.events.notify({ bookId: book.id, bookTitle: book.title, previousStatus, status });
```

## Factory — canales de notificación

**Archivos:** `backend/src/notifications/NotifierFactory.ts`, `backend/src/notifications/INotifier.ts`, `backend/src/notifications/InAppNotifier.ts`, `backend/src/notifications/ConsoleNotifierAdapter.ts`, `backend/src/services/NotificationService.ts`.

La fábrica resuelve canales que comparten `INotifier`. El servicio de notificaciones solicita un canal por nombre y no crea sus implementaciones.

```ts
await this.notifierFactory.create("inapp").send(notification);
await this.notifierFactory.create("console").send(notification);
```

## Adapter — consola

**Archivos:** `backend/src/notifications/ConsoleNotifierAdapter.ts`, `backend/src/notifications/INotifier.ts`.

El adapter convierte el objeto de notificación al texto que necesita `console.log` y conserva la interfaz asíncrona esperada por los canales.

```ts
async send(notification: Notification): Promise<void> {
  console.log(`[NOTIFICACIÓN] Usuario #${notification.userId} | Libro #${notification.bookId} | ${notification.message}`);
}
```

## Principios SOLID

### S — Responsabilidad única

**Archivos:** `backend/src/controllers/`, `backend/src/services/`, `backend/src/repositories/`.

Los controllers traducen HTTP y validan entradas; los servicios coordinan reglas de negocio; los repositorios encapsulan las consultas y escrituras Sequelize.

### O — Abierto/cerrado

**Archivos:** `backend/src/notifications/NotifierFactory.ts`, `backend/src/notifications/INotifier.ts`.

La fábrica registra los canales disponibles con `register()` y `NotificationService` solo solicita el envío a todos los canales registrados. Así, un nuevo canal se incorpora durante la composición de dependencias sin modificar la lógica del servicio.

```ts
factory.register("nuevo-canal", () => new NewChannelNotifier());
await factory.sendToAll(notification);
```

### L — Sustitución de Liskov

**Archivos:** `backend/src/notifications/INotifier.ts`, `backend/src/notifications/InAppNotifier.ts`, `backend/src/notifications/ConsoleNotifierAdapter.ts`.

Ambos canales implementan el mismo contrato `send(notification): Promise<void>`. El consumidor puede sustituir uno por otro o enviar la misma notificación por ambos sin alterar sus precondiciones.

### I — Segregación de interfaces

**Archivos:** `backend/src/repositories/interfaces/`.

Cada interfaz delimita las operaciones que necesita un tipo de persistencia, en lugar de exponer un repositorio genérico con métodos irrelevantes para sus consumidores. Por ejemplo, `IRoleRepository` resuelve roles y permisos, mientras `IBookRepository` opera sobre libros.

### D — Inversión de dependencias

**Archivos:** `backend/src/services/BookService.ts`, `backend/src/services/AuthService.ts`, `backend/src/services/UserService.ts`, `backend/src/repositories/interfaces/`.

Los servicios reciben abstracciones de repositorio por constructor, no instancian modelos Sequelize. `main.ts` construye las implementaciones concretas e inyecta las dependencias.

```ts
constructor(
  private readonly books: IBookRepository,
  private readonly events: EventPublisher,
) {}
```
