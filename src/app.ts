import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Hoster api is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

export default app;
