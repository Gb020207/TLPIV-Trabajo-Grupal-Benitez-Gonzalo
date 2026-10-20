import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  changeBookStatus,
  deleteBook,
  getBook,
} from "../api/books.api";
import {
  getSubscriptionStatus,
  subscribeToBook,
  unsubscribeFromBook,
} from "../api/subscriptions.api";
import { Can } from "../components/Can";
import { useAuth } from "../context/AuthContext";
import type { Book, BookStatus, SubscriptionStatus } from "../types";

const statuses: BookStatus[] = ["DISPONIBLE", "PRESTADO", "EN_REPARACION"];

function isBookStatus(status: string): status is BookStatus {
  return statuses.some((candidate) => candidate === status);
}

export function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookId = Number(id);
  const [book, setBook] = useState<Book | null>(null);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      setError("El identificador del libro no es válido.");
      return;
    }
    Promise.all([getBook(bookId), getSubscriptionStatus(bookId)])
      .then(([bookResult, subscriptionResult]: [Book, SubscriptionStatus]) => {
        if (active) {
          setBook(bookResult);
          setSubscribed(subscriptionResult.subscribed);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudo cargar el libro");
      });
    return () => {
      active = false;
    };
  }, [bookId]);

  async function toggleSubscription() {
    setBusy(true);
    setError("");
    try {
      if (subscribed) {
        await unsubscribeFromBook(bookId);
        setSubscribed(false);
      } else {
        await subscribeToBook(bookId);
        setSubscribed(true);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar la suscripción");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(status: BookStatus) {
    if (!book) return;
    setBusy(true);
    setError("");
    try {
      setBook(await changeBookStatus(book.id, status));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cambiar el estado");
    } finally {
      setBusy(false);
    }
  }

  async function removeBook() {
    if (!book || !window.confirm(`¿Eliminar "${book.title}" del catálogo?`)) return;
    setBusy(true);
    setError("");
    try {
      await deleteBook(book.id);
      navigate("/books", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo eliminar el libro");
      setBusy(false);
    }
  }

  if (error && !book) {
    return <section className="page"><p className="alert" role="alert">{error}</p><Link to="/books">Volver al catálogo</Link></section>;
  }
  if (!book) {
    return <section className="page"><p className="empty-state">Cargando libro...</p></section>;
  }

  return (
    <section className="page detail-page">
      <Link className="back-link" to="/books">← Volver al catálogo</Link>
      {error && <p className="alert" role="alert">{error}</p>}
      <article className="detail-card">
        <div className="detail-cover" aria-hidden="true">
          <span>LECTURA<br />COMPARTIDA</span>
          <span className="cover-index">B / {String(book.id).padStart(2, "0")}</span>
        </div>
        <div className="detail-content">
          <div className="book-card-top">
            <span className={`status status-${book.status.toLowerCase()}`}>
              <span className="status-dot" />
              {book.status.replace("_", " ")}
            </span>
            <span className="book-number">LIBRO #{book.id}</span>
          </div>
          <h1>{book.title}</h1>
          <p className="detail-description">{book.description}</p>
          <p className="detail-meta">
            En el catálogo desde {new Date(book.createdAt).toLocaleDateString("es-AR")}
          </p>
          <div className="detail-actions">
            <Can permission={subscribed ? "subscription:delete" : "subscription:create"}>
              <button
                className={`button ${subscribed ? "button-outline" : "button-primary"}`}
                onClick={() => void toggleSubscription()}
                disabled={busy || subscribed === null}
              >
                {subscribed ? "Dejar de seguir" : "＋ Seguir este libro"}
              </button>
            </Can>
            {user?.permissions.includes("book:change-status") && (
              <label className="status-control">
                Cambiar estado
                <select
                  value={book.status}
                  disabled={busy}
                  onChange={(event) => {
                    if (isBookStatus(event.target.value)) {
                      void updateStatus(event.target.value);
                    }
                  }}
                >
                  {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                </select>
              </label>
            )}
          </div>
          <Can permission="book:update">
            <Link className="text-link" to={`/books/${book.id}/edit`}>Editar datos del libro →</Link>
          </Can>
          <Can permission="book:delete">
            <button className="text-button text-danger" disabled={busy} onClick={() => void removeBook()}>
              Eliminar libro
            </button>
          </Can>
        </div>
      </article>
    </section>
  );
}
