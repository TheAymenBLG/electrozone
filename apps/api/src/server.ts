import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { catalogRouter } from "./routes/catalog.js";
import { productRouter } from "./routes/products.js";
import { bundleRouter } from "./routes/bundles.js";
import { offerRouter } from "./routes/offers.js";
import { orderRouter } from "./routes/orders.js";
import { assistantRouter } from "./routes/assistant.js";
import { authRouter } from "./routes/auth.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: config.webOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/catalog", catalogRouter);
app.use("/api/products", productRouter);
app.use("/api/bundles", bundleRouter);
app.use("/api/offers", offerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/assistant", assistantRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[api] listening on http://localhost:${config.port} (CORS: ${config.webOrigin})`);
});