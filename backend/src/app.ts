import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import booksRoutes from "./routes/books.routes.js";

export function createApp(): express.Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      ok: true,
      message: "API funcionando",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/books", booksRoutes);

  return app;
}
