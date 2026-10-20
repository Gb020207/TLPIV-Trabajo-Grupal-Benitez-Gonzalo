import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { createBook, getBook, updateBook } from "../api/books.api";
import type { BookInput } from "../api/books.api";

export function BookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editingId = id === undefined ? null : Number(id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (editingId === null) return;
    if (!Number.isSafeInteger(editingId) || editingId <= 0) {
      setError("El identificador del libro no es válido.");
      return;
    }
    let active = true;
    getBook(editingId)
      .then((book) => {
        if (active) {
          setTitle(book.title);
          setDescription(book.description);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudo cargar el libro");
      });
    return () => {
      active = false;
    };
  }, [editingId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const input: BookInput = { title: title.trim(), description: description.trim() };
    try {
      const book =
        editingId === null
          ? await createBook(input)
          : await updateBook(editingId, input);
      navigate(`/books/${book.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el libro");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page narrow-page">
      <Link className="back-link" to={editingId ? `/books/${editingId}` : "/books"}>
        ← Volver
      </Link>
      <div className="page-heading compact-heading">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h1>{editingId === null ? "Sumar un libro." : "Editar libro."}</h1>
        </div>
      </div>
      <form className="panel form-stack" onSubmit={submit}>
        <label>
          Título
          <input
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Descripción
          <textarea
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="form-actions">
          <Link className="button button-quiet" to={editingId ? `/books/${editingId}` : "/books"}>
            Cancelar
          </Link>
          <button className="button button-primary" disabled={busy}>
            {busy ? "Guardando..." : "Guardar libro"}
          </button>
        </div>
      </form>
    </section>
  );
}
