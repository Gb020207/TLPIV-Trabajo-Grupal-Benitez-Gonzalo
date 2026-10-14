import type { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService.js";
import { ServiceError } from "../services/ServiceError.js";

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

class NotificationControllers {
  constructor(private readonly notificationService: NotificationService) {}

  async listMine(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    try {
      response
        .status(200)
        .json(await this.notificationService.listMine(userId));
    } catch (error) {
      this.handleError(error, response, "Failed to list notifications:");
    }
  }

  async markAsRead(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    const notificationId = parsePositiveInteger(request.params.id);
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }
    if (notificationId === null) {
      response.status(400).json({
        message: "El ID de la notificación no es válido",
      });
      return;
    }

    try {
      response
        .status(200)
        .json(
          await this.notificationService.markAsRead(userId, notificationId),
        );
    } catch (error) {
      this.handleError(error, response, "Failed to mark notification as read:");
    }
  }

  private handleError(
    error: unknown,
    response: Response,
    context: string,
  ): void {
    if (error instanceof ServiceError) {
      response.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error(context, error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
}

export default NotificationControllers;
