import dotenv from "dotenv";

dotenv.config();

export const env = {
  dbHost: process.env.DB_HOST ?? "localhost",
  dbPort: Number(process.env.DB_PORT ?? 5432),
  dbUser: process.env.DB_USER ?? "biblioteca",
  dbPassword: process.env.DB_PASSWORD ?? "biblioteca",
  dbName: process.env.DB_NAME ?? "biblioteca",

  apiPort: Number(process.env.API_PORT ?? 3000),

  jwtSecret: process.env.JWT_SECRET ?? "development-secret",
};