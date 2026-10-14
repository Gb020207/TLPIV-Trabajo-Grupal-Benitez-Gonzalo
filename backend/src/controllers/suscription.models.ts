import type { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import { Books } from "../models/book.models.js";
import { Suscription } from "../models/suscription.models.js";

class SubscriptionControllers {
  async subscribe(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    const bookId = Number(request.params.bookId);
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }
    if (!Number.isSafeInteger(bookId) || bookId < 1) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      const book = await Books.findByPk(bookId);
      if (!book) {
        response.status(404).json({ message: "Libro no encontrado" });
        return;
      }

      const existingSubscription = await Suscription.findOne({
        where: { userId, bookId },
      });
      if (existingSubscription) {
        response.status(409).json({ message: "Ya estás suscripto a este libro" });
        return;
      }

      const subscription = await Suscription.create({ userId, bookId });
      response.status(201).json(subscription);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        response.status(409).json({ message: "Ya estás suscripto a este libro" });
        return;
      }
      console.error("Failed to subscribe user to book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async unsubscribe(request: Request, response: Response): Promise<void> {
    const userId = request.auth?.userId;
    const bookId = Number(request.params.bookId);
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }
    if (!Number.isSafeInteger(bookId) || bookId < 1) {
      response.status(400).json({ message: "El ID del libro no es válido" });
      return;
    }

    try {
      const deletedCount = await Suscription.destroy({
        where: { userId, bookId },
      });
      if (deletedCount === 0) {
        response.status(404).json({ message: "No existe esa suscripción" });
        return;
      }

      response.status(204).end();
    } catch (error) {
      console.error("Failed to unsubscribe user from book:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async listMySubscriptions(
    request: Request,
    response: Response,
  ): Promise<void> {
    const userId = request.auth?.userId;
    if (!userId) {
      response.status(401).json({ message: "Autenticación requerida" });
      return;
    }

    try {
      const subscriptions = await Suscription.findAll({
        where: { userId },
        include: [{ model: Books, as: "book" }],
        order: [["id", "ASC"]],
      });
      response.status(200).json(subscriptions);
    } catch (error) {
      console.error("Failed to list user subscriptions:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

export default SubscriptionControllers;
