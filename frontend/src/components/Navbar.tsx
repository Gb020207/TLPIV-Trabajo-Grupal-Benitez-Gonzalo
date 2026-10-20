import { Link, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Can from "./Can";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">📚 Biblioteca</Link>
        <div className="nav-links">
          <Link to="/">Libros</Link>
          <Can permission="user:read">
            <Link to="/admin/users">Usuarios</Link>
          </Can>
        </div>
        <div className="nav-right">
          <Can permission="notification:read">
            <NotificationBell />
          </Can>
          <span className="muted">{user?.name} ({user?.role})</span>
          <button className="btn btn-secondary" onClick={logout}>Salir</button>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
