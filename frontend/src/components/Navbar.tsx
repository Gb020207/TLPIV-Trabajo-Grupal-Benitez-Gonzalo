import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/books">
        <span className="brand-mark" aria-hidden="true">B</span>
        <span>Biblioteca</span>
      </Link>
      <nav className="main-nav" aria-label="Navegación principal">
        <NavLink className="nav-link" to="/books">Libros</NavLink>
        <Can permission="book:create">
          <NavLink className="nav-link" to="/books/new">Nuevo libro</NavLink>
        </Can>
        <Can permission="user:read">
          <NavLink className="nav-link" to="/admin/users">Usuarios</NavLink>
        </Can>
        <NotificationBell />
      </nav>
      <div className="account">
        <span className="account-name">{user?.name}</span>
        <span className="role-chip">{user?.role}</span>
        <button className="button button-quiet button-small" onClick={signOut}>
          Salir
        </button>
      </div>
    </header>
  );
}
