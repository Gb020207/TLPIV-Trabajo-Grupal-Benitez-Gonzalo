import { Router } from "express";
import BookControllers from "../controllers/book.controllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import type { ISubject } from "../observer/ISubject.js";

export function createBooksRoutes(eventPublisher: ISubject): Router {
  const booksRoutes = Router();
  const bookControllers = new BookControllers(eventPublisher);

  booksRoutes.use(authenticate);
  booksRoutes.get("/", authorize("book:read"), (request, response) =>
    bookControllers.listBooks(request, response),
  );
  booksRoutes.get("/:id", authorize("book:read"), (request, response) =>
    bookControllers.getBook(request, response),
  );
  booksRoutes.post("/", authorize("book:create"), (request, response) =>
    bookControllers.createBook(request, response),
  );
  booksRoutes.patch("/:id", authorize("book:update"), (request, response) =>
    bookControllers.updateBook(request, response),
  );
  booksRoutes.patch(
    "/:id/status",
    authorize("book:change-status"),
    (request, response) => bookControllers.changeBookStatus(request, response),
  );
  booksRoutes.delete("/:id", authorize("book:delete"), (request, response) =>
    bookControllers.deleteBook(request, response),
  );

  return booksRoutes;
}
