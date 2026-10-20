import { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "../api/notifications.api";
import type { AppNotification } from "../types";

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setItems((await notificationsApi.list()).notifications);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar notificaciones");
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(timer);
  }, [load]);

  async function markRead(id: number) {
    try {
      await notificationsApi.markAsRead(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al marcar como leída");
    }
  }

  return (
    <>
      <h1>Notificaciones</h1>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <p className="muted">No tenés notificaciones.</p>
      ) : (
        <ul className="notif-list">
          {items.map((n) => (
            <li key={n.id} className={`card notif ${n.read ? "read" : "unread"}`}>
              <div>
                <p>{n.message}</p>
                <small className="muted">{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              {!n.read && (
                <button className="btn btn-secondary" onClick={() => void markRead(n.id)}>
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
