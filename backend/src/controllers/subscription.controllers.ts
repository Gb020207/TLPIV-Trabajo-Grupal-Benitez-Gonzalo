import type { Request, Response } from "express";
import type { SubscriptionService } from "../services/SubscriptionService.js";

function parseId(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

class SubscriptionControllers {
  constructor(private readonly subscriptions: SubscriptionService) {}

  async subscribe(request: Request, response: Response): Promise<void> {
    const bookId = parseId(request.params.bookId);
    const userId = request.auth?.userId;
    if (bookId === null || userId === undefined) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      const result = await this.subscriptions.subscribe(userId, bookId);
      if (!result) {
        response.status(404).json({ message: "Libro no encontrado" });
        return;
      }
      response.status(result.created ? 201 : 200).json(result.subscription);
    } catch (error) {
      console.error("Failed to subscribe to book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async unsubscribe(request: Request, response: Response): Promise<void> {
    const bookId = parseId(request.params.bookId);
    const userId = request.auth?.userId;
    if (bookId === null || userId === undefined) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      const deleted = await this.subscriptions.unsubscribe(userId, bookId);
      if (deleted === 0) {
        response.status(404).json({ message: "No existe esa suscripción" });
        return;
      }
      response.status(204).end();
    } catch (error) {
      console.error("Failed to unsubscribe from book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default SubscriptionControllers;
