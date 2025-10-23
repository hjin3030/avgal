import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "avgal",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: console.log, // AHORA VERÁS TODOS LOS QUERIES Y FALLAS EN CONSOLA
    // Opcional: Si quieres, puedes meter searchPath: 'public' aquí explícitamente
    // dialectOptions: { searchPath: "public" },
  }
);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos PostgreSQL.");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};
