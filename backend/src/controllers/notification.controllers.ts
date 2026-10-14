import type { Request, Response } from "express";
import type { NotificationInboxService } from "../services/NotificationInboxService.js";

function parseId(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

class NotificationControllers {
  constructor(private readonly notifications: NotificationInboxService) {}

  async listMine(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    if (userId === undefined) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    try {
      const [notifications, unreadCount] = await Promise.all([
        this.notifications.list(userId),
        this.notifications.unreadCount(userId),
      ]);
      response.status(200).json({ notifications, unreadCount });
    } catch (error) {
      console.error("Failed to list notifications:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async unreadCount(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    if (userId === undefined) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    try {
      response.status(200).json({
        unreadCount: await this.notifications.unreadCount(userId),
      });
    } catch (error) {
      console.error("Failed to count unread notifications:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async markAsRead(request: Request, response: Response): Promise<void> {
    const id = parseId(request.params.id);
    const userId = request.auth?.userId;
    if (id === null || userId === undefined) {
      response.status(400).json({ message: "El ID de la notificación no es válido" });
      return;
    }

    try {
      const notification = await this.notifications.markAsRead(id, userId);
      if (!notification) {
        response.status(404).json({ message: "Notificación no encontrada" });
        return;
      }
      response.status(200).json(notification);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default NotificationControllers;
