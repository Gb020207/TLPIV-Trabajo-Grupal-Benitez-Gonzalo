import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listBooks } from "../api/books.api";
import { Can } from "../components/Can";
import {
  getSubscriptionStatus,
  subscribeToBook,
  unsubscribeFromBook,
} from "../api/subscriptions.api";
import type { Book } from "../types";

export function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<number, boolean>>({});
  const [busyBookId, setBusyBookId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listBooks()
      .then(async (items) => {
        if (active) setBooks(items);
        const statuses = await Promise.all(
          items.map(async (book) => {
            const status = await getSubscriptionStatus(book.id);
            return [book.id, status.subscribed] as const;
          }),
        );
        if (active) setSubscriptions(Object.fromEntries(statuses));
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudieron cargar los libros");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function toggleSubscription(bookId: number) {
    const subscribed = subscriptions[bookId];
    if (subscribed === undefined) return;

    setBusyBookId(bookId);
    setError("");
    try {
      if (subscribed) {
        await unsubscribeFromBook(bookId);
      } else {
        await subscribeToBook(bookId);
      }
      setSubscriptions((current) => ({ ...current, [bookId]: !subscribed }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar tu catálogo");
    } finally {
      setBusyBookId(null);
    }
  }

  const availableBooks = books.filter((book) => book.status === "DISPONIBLE").length;

  return (
    <section className="page">
      <div className="catalog-hero">
        <div className="catalog-intro">
          <span className="eyebrow">Biblioteca · catálogo vivo</span>
          <h1>Encontrá tu próxima lectura.</h1>
          <p>Seguí un libro y te avisamos cuando cambie su disponibilidad.</p>
          <Can permission="book:create">
            <Link className="button catalog-button" to="/books/new">＋ Agregar libro</Link>
          </Can>
        </div>
        <aside className="catalog-spotlight" aria-label="Libros disponibles">
          <span className="spotlight-book" aria-hidden="true">B</span>
          <span className="spotlight-label">Listos para leer</span>
          <strong>{loading ? "—" : availableBooks}</strong>
          <span className="spotlight-caption">libros disponibles</span>
        </aside>
      </div>

      <div className="collection-heading">
        <div>
          <span className="eyebrow">Para descubrir</span>
          <h2>La colección</h2>
        </div>
        {!loading && <span className="collection-count">{books.length} {books.length === 1 ? "libro" : "libros"}</span>}
      </div>

      {error && <p className="alert" role="alert">{error}</p>}
      {loading ? (
        <p className="empty-state">Cargando catálogo...</p>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <h2>Todavía no hay libros en la biblioteca.</h2>
          <p>Cuando un administrador o un operador agregue libros, vas a poder sumarlos a tu catálogo desde acá.</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <article className="book-card" key={book.id}>
              <div className="book-card-top">
                <span className={`status status-${book.status.toLowerCase()}`}>
                  <span className="status-dot" />
                  {book.status.replace("_", " ")}
                </span>
                <span className="book-number">#{book.id}</span>
              </div>
              <h2>{book.title}</h2>
              <p>{book.description}</p>
              <div className="book-card-actions">
                <Link className="text-link" to={`/books/${book.id}`}>
                  Ver libro <span aria-hidden="true">↗</span>
                </Link>
                <Can permission={subscriptions[book.id] ? "subscription:delete" : "subscription:create"}>
                  <button
                    className={`button button-small ${subscriptions[book.id] ? "button-outline" : "button-primary"}`}
                    onClick={() => void toggleSubscription(book.id)}
                    disabled={subscriptions[book.id] === undefined || busyBookId === book.id}
                  >
                    {busyBookId === book.id
                      ? "Guardando..."
                      : subscriptions[book.id]
                        ? "Quitar"
                        : "＋ Añadir"}
                  </button>
                </Can>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
