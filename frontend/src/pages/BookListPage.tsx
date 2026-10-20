import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listBooks } from "../api/books.api";
import { Can } from "../components/Can";
import type { Book } from "../types";

export function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listBooks()
      .then((items) => {
        if (active) setBooks(items);
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

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h1>Encontrá tu próxima lectura.</h1>
          <p className="muted">Seguí un libro y te avisamos cuando cambie su disponibilidad.</p>
        </div>
        <Can permission="book:create">
          <Link className="button button-primary" to="/books/new">＋ Agregar libro</Link>
        </Can>
      </div>

      {error && <p className="alert" role="alert">{error}</p>}
      {loading ? (
        <p className="empty-state">Cargando catálogo...</p>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">⌕</span>
          <h2>El catálogo está esperando sus primeros libros.</h2>
          <p>Cuando haya libros disponibles, los vas a encontrar acá.</p>
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
              <Link className="text-link" to={`/books/${book.id}`}>
                Ver libro <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
