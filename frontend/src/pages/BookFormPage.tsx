import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { booksApi } from "../api/books.api";

export default function BookFormPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingId === null) return;
    booksApi
      .get(editingId)
      .then((b) => {
        setTitle(b.title);
        setDescription(b.description);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Error al cargar el libro"),
      );
  }, [editingId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const input = { title, description };
      const book =
        editingId === null
          ? await booksApi.create(input)
          : await booksApi.update(editingId, input);
      navigate(`/books/${book.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <p><Link to="/">← Volver</Link></p>
      <form className="card form" onSubmit={onSubmit}>
        <h1>{editingId === null ? "Nuevo libro" : "Editar libro"}</h1>
        {error && <p className="error">{error}</p>}
        <label>Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
        </label>
        <label>Descripción
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
        </label>
        <button className="btn" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </form>
    </>
  );
}
