import type { Request, Response } from "express";
import type { BookStatus } from "../models/book.models.js";
import { BookService, BookServiceError } from "../services/BookService.js";

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
  constructor(private readonly bookService: BookService) {}

  async listBooks(_request: Request, response: Response): Promise<void> {
    try {
      response.status(200).json(await this.bookService.listBooks());
    } catch (error) {
      this.handleError(error, response, "Failed to list books:");
    }
  }

  async getBook(request: Request, response: Response): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      response.status(200).json(await this.bookService.getBook(id));
    } catch (error) {
      this.handleError(error, response, "Failed to get book:");
    }
  }

  async createBook(request: Request, response: Response): Promise<void> {
    if (
      !isRecord(request.body) ||
      typeof request.body.title !== "string" ||
      typeof request.body.description !== "string"
    ) {
      response.status(400).json({
        message: "El título y la descripción deben ser texto",
      });
      return;
    }

    try {
      const book = await this.bookService.createBook({
        title: request.body.title,
        description: request.body.description,
      });
      response.status(201).json(book);
    } catch (error) {
      this.handleError(error, response, "Failed to create book:");
    }
  }

  async updateBook(request: Request, response: Response): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }
    if (!isRecord(request.body)) {
      response.status(400).json({
        message: "El cuerpo de la solicitud no es válido",
      });
      return;
    }

    const data: { title?: string; description?: string } = {};
    if (request.body.title !== undefined) {
      if (typeof request.body.title !== "string") {
        response.status(400).json({ message: "El título debe ser texto" });
        return;
      }
      data.title = request.body.title;
    }
    if (request.body.description !== undefined) {
      if (typeof request.body.description !== "string") {
        response.status(400).json({ message: "La descripción debe ser texto" });
        return;
      }
      data.description = request.body.description;
    }

    try {
      response.status(200).json(await this.bookService.updateBook(id, data));
    } catch (error) {
      this.handleError(error, response, "Failed to update book:");
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
    if (!isRecord(request.body) || !isBookStatus(request.body.status)) {
      response.status(400).json({
        message: "El estado debe ser DISPONIBLE, PRESTADO o EN_REPARACION",
      });
      return;
    }

    try {
      response
        .status(200)
        .json(await this.bookService.changeBookStatus(id, request.body.status));
    } catch (error) {
      this.handleError(error, response, "Failed to change book status:");
    }
  }

  async deleteBook(request: Request, response: Response): Promise<void> {
    const id = parseBookId(request.params.id);
    if (id === null) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      await this.bookService.deleteBook(id);
      response.status(204).end();
    } catch (error) {
      this.handleError(error, response, "Failed to delete book:");
    }
  }

  private handleError(
    error: unknown,
    response: Response,
    context: string,
  ): void {
    if (error instanceof BookServiceError) {
      response.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error(context, error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
}

export default BookControllers;
