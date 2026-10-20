import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { notificationsApi } from "../api/notifications.api";

const POLL_MS = 5000;

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const inbox = await notificationsApi.list();
      setUnread(inbox.unreadCount);
    } catch {
      /* el polling ignora errores transitorios */
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <Link to="/notifications" className="bell" title="Notificaciones">
      🔔
      {unread > 0 && <span className="badge">{unread}</span>}
    </Link>
  );
}
