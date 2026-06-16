import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "../.env" });

import express from "express";
import cors from "cors";
import { config } from "./config";
import { authRouter } from "./routes/auth";
import { estudiantesRouter } from "./routes/estudiantes";
import { docentesRouter } from "./routes/docentes";
import { pagosRouter } from "./routes/pagos";
import { controlPagosRouter } from "./routes/control-pagos";
import { gruposRouter } from "./routes/grupos";
import { dashboardRouter } from "./routes/dashboard";
import { noticiasRouter } from "./routes/noticias";
import { configuracionRouter } from "./routes/configuracion";
import { testimoniosRouter } from "./routes/testimonios";
import { comentariosRouter } from "./routes/comentarios";

const app = express();

const allowedOrigins = ["http://localhost:3000"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/estudiantes", estudiantesRouter);
app.use("/api/docentes", docentesRouter);
app.use("/api/pagos", pagosRouter);
app.use("/api/control-pagos", controlPagosRouter);
app.use("/api/grupos", gruposRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/noticias", noticiasRouter);
app.use("/api/configuracion", configuracionRouter);
app.use("/api/testimonios", testimoniosRouter);
app.use("/api/comentarios", comentariosRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.port, () => {
  console.log(`Backend corriendo en http://localhost:${config.port}`);
});
