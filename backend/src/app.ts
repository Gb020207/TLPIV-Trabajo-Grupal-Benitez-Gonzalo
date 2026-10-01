import express from "express";
import { env } from "./config/env.js";
import { DatabaseConnection } from "./config/db.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

const start = async () => {
  try {
    const connection = DatabaseConnection.getInstance();
    await connection.connect();

    app.listen(env.apiPort, () => {
      console.log(`Servidor escuchando en el puerto ${env.apiPort}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error);
    process.exit(1);
  }
};

start();