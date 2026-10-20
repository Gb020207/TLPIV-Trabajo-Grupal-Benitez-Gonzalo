import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  listNotifications,
  markNotificationRead,
} from "../api/notifications.api";
import type { Notification } from "../types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await listNotifications();
    setNotifications(result.notifications);
  }, []);

  useEffect(() => {
    let active = true;
    refresh()
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudieron cargar las notificaciones");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  async function markAsRead(id: number) {
    setError("");
    try {
      await markNotificationRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification,
        ),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo marcar como leída");
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <section className="page narrow-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Tu actividad</span>
          <h1>Notificaciones<span className="heading-count">{unreadCount}</span></h1>
          <p className="muted">Novedades de los libros que estás siguiendo.</p>
        </div>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      {loading ? (
        <p className="empty-state">Cargando notificaciones...</p>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">✳</span>
          <h2>Por ahora, todo tranquilo.</h2>
          <p>Cuando cambie el estado de un libro que seguís, vas a encontrar el aviso acá.</p>
          <Link className="button button-primary" to="/books">Explorar libros</Link>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <article className={`notification-card ${notification.read ? "" : "is-unread"}`} key={notification.id}>
              <span className="notification-marker" aria-hidden="true" />
              <div className="notification-copy">
                <p>{notification.message}</p>
                <span>{new Date(notification.createdAt).toLocaleString("es-AR")}</span>
                <Link className="text-link" to={`/books/${notification.bookId}`}>Ver libro →</Link>
              </div>
              {!notification.read && (
                <button className="button button-quiet button-small" onClick={() => void markAsRead(notification.id)}>
                  Marcar leída
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
