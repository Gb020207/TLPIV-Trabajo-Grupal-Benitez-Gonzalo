import type { Request, Response } from "express";
import { Notification } from "../models/notification.models.js";

class NotificationControllers {
  async listMine(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    try {
      const notifications = await Notification.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      const unreadCount = notifications.filter(({ read }) => !read).length;
      response.status(200).json({ notifications, unreadCount });
    } catch (error) {
      console.error("Failed to list notifications:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async markAsRead(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    const notificationId = Number(request.params.id);
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }
    if (!Number.isSafeInteger(notificationId) || notificationId < 1) {
      response.status(400).json({ message: "El ID de la notificación no es válido" });
      return;
    }

    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId },
      });
      if (!notification) {
        response.status(404).json({ message: "Notificación no encontrada" });
        return;
      }

      if (!notification.read) {
        await notification.update({ read: true });
      }
      response.status(200).json(notification);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default NotificationControllers;
