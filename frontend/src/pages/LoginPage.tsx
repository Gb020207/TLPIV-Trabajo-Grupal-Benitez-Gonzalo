import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { login } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { token, saveSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (token) {
    return <Navigate to="/books" replace />;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      saveSession(await login(email, password));
      navigate("/books", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesión");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <span className="eyebrow">Biblioteca · seguimiento de libros</span>
        <h1>Qué bueno verte.</h1>
        <p className="muted">Ingresá para seguir tus libros y recibir novedades.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>
            Email
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="alert" role="alert">{error}</p>}
          <button className="button button-primary button-wide" disabled={busy}>
            {busy ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
        <p className="auth-switch">
          ¿Todavía no tenés una cuenta? <Link to="/register">Registrate</Link>
        </p>
      </section>
    </main>
  );
}
