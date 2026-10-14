import cors from "cors";
import express from "express";

export function createApp(): express.Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/health", (_request, response) => {
        response.status(200).json({ status: "ok" });
    });

    return app;
}
