require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { initDatabase } = require("./config/database");
const { runSeedIfEmpty } = require("./config/seed");
const { swaggerSpec } = require("./config/swagger");
const autorRoutes = require("./routes/autor.routes");
const libroRoutes = require("./routes/libro.routes");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { service: "api-libreria", status: "ok" },
  });
});

app.use("/autores", autorRoutes);
app.use("/libros", libroRoutes);
app.get("/api-docs.json", (_req, res) => {
  res.status(200).json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Ruta no encontrada",
    },
  });
});

const port = Number(process.env.PORT || 4040);

async function startServer() {
  try {
    await initDatabase();
    await runSeedIfEmpty();
    app.listen(port, () => {
      console.log(`API escuchando en puerto ${port}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar la aplicacion:", error.message);
    process.exit(1);
  }
}

startServer();
