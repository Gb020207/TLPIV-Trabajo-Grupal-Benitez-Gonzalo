import type { Request, Response } from "express";
import type { BookStatus } from "../models/book.models.js";
import type { BookService } from "../services/BookService.js";

const bookStatuses: readonly BookStatus[] = [
  "DISPONIBLE",
  "PRESTADO",
  "EN_REPARACION",
];

function parseBookId(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBookStatus(value: unknown): value is BookStatus {
  return (
    typeof value === "string" &&
    bookStatuses.some((bookStatus) => bookStatus === value)
  );
}

class BookControllers {
  constructor(private readonly books: BookService) {}

  async listBooks(_request: Request, response: Response): Promise<void> {
    try {
      const books = await this.books.list();
      response.status(200).json(books);
    } catch (error) {
      console.error("Failed to list books:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getBook(request: Request, response: Response): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      const book = await this.books.findById(id);
      if (!book) {
        response.status(404).json({ message: "Libro no encontrado" });
        return;
      }

      response.status(200).json(book);
    } catch (error) {
      console.error("Failed to get book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async createBook(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!isRecord(request.body)) {
      response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
      return;
    }
    const { title, description } = request.body;
    if (!isNonEmptyString(title) || !isNonEmptyString(description)) {
      response.status(400).json({
        message: "El título y la descripción del libro son obligatorios",
      });
      return;
    }

    try {
      const book = await this.books.create({
        title: title.trim(),
        description: description.trim(),
      });
      response.status(201).json(book);
    } catch (error) {
      console.error("Failed to create book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async updateBook(
    request: Request,
    response: Response,
  ): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    if (!isRecord(request.body)) {
      response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
      return;
    }
    const { title, description } = request.body;
    const values: { title?: string; description?: string } = {};
    if (title !== undefined) {
      if (!isNonEmptyString(title)) {
        response.status(400).json({ message: "El título no es válido" });
        return;
      }
      values.title = title.trim();
    }
    if (description !== undefined) {
      if (!isNonEmptyString(description)) {
        response.status(400).json({ message: "La descripción no es válida" });
        return;
      }
      values.description = description.trim();
    }
    if (Object.keys(values).length === 0) {
      response.status(400).json({
        message: "Debe indicar el título o la descripción para actualizar",
      });
      return;
    }

    try {
      const book = await this.books.findById(id);
      if (!book) {
        response.status(404).json({ message: "Libro no encontrado" });
        return;
      }

      await this.books.update(book, values);
      response.status(200).json(book);
    } catch (error) {
      console.error("Failed to update book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async changeBookStatus(
    request: Request,
    response: Response,
  ): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    if (!isRecord(request.body)) {
      response.status(400).json({ message: "El cuerpo de la solicitud no es válido" });
      return;
    }
    const { status } = request.body;
    if (!isBookStatus(status)) {
      response.status(400).json({
        message: "El estado debe ser DISPONIBLE, PRESTADO o EN_REPARACION",
      });
      return;
    }

    try {
      const book = await this.books.findById(id);
      if (!book) {
        response.status(404).json({ message: "Libro no encontrado" });
        return;
      }

      await this.books.changeStatus(book, status);
      response.status(200).json(book);
    } catch (error) {
      console.error("Failed to change book status:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async deleteBook(request: Request, response: Response): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      const book = await this.books.findById(id);
      if (!book) {
        response.status(404).json({ message: "Libro no encontrado" });
        return;
      }

      await this.books.delete(book);
      response.status(204).end();
    } catch (error) {
      console.error("Failed to delete book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default BookControllers;
