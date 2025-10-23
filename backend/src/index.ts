import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";

// IMPORTS DIRECTOS CON NOMBRES Y MAYÚSCULAS EXACTAS
import "./models/Contador";
import "./models/Merma";
import "./models/Stock";
import "./models/User";
import "./models/Vale";
import "./models/ValeDetalle";
// Index.ts solo importa si tiene definiciones de modelos (si no, omitirlo)

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Backend AVGAL funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL correctamente");

    await sequelize.sync({ force: true, logging: console.log });
    console.log("✅ Modelos sincronizados con la base de datos");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

startServer();
