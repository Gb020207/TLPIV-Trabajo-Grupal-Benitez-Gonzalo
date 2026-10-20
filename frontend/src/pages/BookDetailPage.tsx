import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { booksApi, subscriptionsApi } from "../api/books.api";
import Can from "../components/Can";
import { useAuth } from "../context/AuthContext";
import { BOOK_STATUSES, type Book, type BookStatus } from "../types";
import { StatusBadge } from "./BookListPage";

export default function BookDetailPage() {
  const { id } = useParams();
  const bookId = Number(id);
  const navigate = useNavigate();
  const { can } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setBook(await booksApi.get(bookId));
      if (can("subscription:create")) {
        const subs = await subscriptionsApi.listMine();
        setSubscribed(subs.some((s) => s.bookId === bookId));
      }
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el libro");
    }
  }, [bookId, can]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBusy(false);
    }
  }

  const toggleSubscription = () =>
    run(async () => {
      if (subscribed) await subscriptionsApi.unsubscribe(bookId);
      else await subscriptionsApi.subscribe(bookId);
      setSubscribed(!subscribed);
    });

  const changeStatus = (status: BookStatus) =>
    run(async () => setBook(await booksApi.changeStatus(bookId, status)));

  const remove = () =>
    run(async () => {
      if (!window.confirm("¿Eliminar este libro?")) return;
      await booksApi.remove(bookId);
      navigate("/");
    });

  if (!book) return error ? <p className="error">{error}</p> : <p>Cargando...</p>;

  return (
    <>
      <p><Link to="/">← Volver</Link></p>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <div className="card-head">
          <h1>{book.title}</h1>
          <StatusBadge status={book.status} />
        </div>
        <p>{book.description}</p>
        <p className="muted">
          Creado: {new Date(book.createdAt).toLocaleString()} · Actualizado:{" "}
          {new Date(book.updatedAt).toLocaleString()}
        </p>
        <div className="actions">
          <Can permission="subscription:create">
            <button className="btn" disabled={busy} onClick={() => void toggleSubscription()}>
              {subscribed ? "Desuscribirme" : "Suscribirme"}
            </button>
          </Can>
          <Can permission="book:update">
            <Link to={`/books/${book.id}/edit`} className="btn btn-secondary">Editar</Link>
          </Can>
          <Can permission="book:delete">
            <button className="btn btn-danger" disabled={busy} onClick={() => void remove()}>Eliminar</button>
          </Can>
        </div>
        <Can permission="book:change-status">
          <div className="status-box">
            <strong>Cambiar estado:</strong>{" "}
            {BOOK_STATUSES.map((s) => (
              <button
                key={s}
                className="btn btn-secondary"
                disabled={busy || s === book.status}
                onClick={() => void changeStatus(s)}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </Can>
      </div>
    </>
  );
}
