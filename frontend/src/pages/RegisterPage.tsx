import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { register } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { token, saveSession } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      saveSession(await register(name, email, password));
      navigate("/books", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear la cuenta");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <span className="eyebrow">Tu próxima lectura empieza acá</span>
        <h1>Crear cuenta.</h1>
        <p className="muted">Vas a poder seguir libros y enterarte cuando cambien de estado.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>
            Nombre
            <input
              autoComplete="name"
              maxLength={50}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
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
            Contraseña <span className="label-hint">· mínimo 8 caracteres</span>
            <input
              autoComplete="new-password"
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="alert" role="alert">{error}</p>}
          <button className="button button-primary button-wide" disabled={busy}>
            {busy ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </section>
    </main>
  );
}
