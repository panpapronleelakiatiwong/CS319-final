import cors from "cors";
import "dotenv/config";
import express from "express";
import { errorHandler, notFound } from "./middlewares/error";
import casesRouter from "./routes/cases";
import itemsRouter from "./routes/items";
import { categoriesRouter, statsRouter, usersRouter } from "./routes/meta";
import reservationsRouter from "./routes/reservations";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/items", itemsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);
app.use("/api/cases", casesRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/stats", statsRouter);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
