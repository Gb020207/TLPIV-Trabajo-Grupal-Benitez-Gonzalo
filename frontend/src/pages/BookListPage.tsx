import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { booksApi } from "../api/books.api";
import Can from "../components/Can";
import type { Book } from "../types";

export function StatusBadge({ status }: { status: Book["status"] }) {
  return <span className={`status status-${status}`}>{status.replace("_", " ")}</span>;
}

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setBooks(await booksApi.list());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar libros");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(book: Book) {
    if (!window.confirm(`¿Eliminar "${book.title}"?`)) return;
    try {
      await booksApi.remove(book.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Libros</h1>
        <Can permission="book:create">
          <Link to="/books/new" className="btn">+ Nuevo libro</Link>
        </Can>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : books.length === 0 ? (
        <p className="muted">No hay libros cargados.</p>
      ) : (
        <div className="grid">
          {books.map((book) => (
            <div className="card" key={book.id}>
              <div className="card-head">
                <h3>{book.title}</h3>
                <StatusBadge status={book.status} />
              </div>
              <p className="muted clamp">{book.description}</p>
              <div className="actions">
                <Link to={`/books/${book.id}`} className="btn btn-secondary">Ver</Link>
                <Can permission="book:update">
                  <Link to={`/books/${book.id}/edit`} className="btn btn-secondary">Editar</Link>
                </Can>
                <Can permission="book:delete">
                  <button className="btn btn-danger" onClick={() => void onDelete(book)}>Eliminar</button>
                </Can>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
