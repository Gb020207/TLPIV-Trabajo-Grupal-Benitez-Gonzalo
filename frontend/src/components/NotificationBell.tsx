import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getUnreadCount } from "../api/notifications.api";
import { useAuth } from "../context/AuthContext";

export function NotificationBell() {
  const { token } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setCount(0);
      return;
    }

    let active = true;
    const refresh = async () => {
      try {
        const unread = await getUnreadCount();
        if (active) {
          setCount(unread);
        }
      } catch (error) {
        console.error("No se pudo actualizar el contador de notificaciones:", error);
      }
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), 5000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [token]);

  return (
    <Link className="nav-link notification-link" to="/notifications">
      Notificaciones
      {count > 0 && <span className="notification-count">{count}</span>}
    </Link>
  );
}
