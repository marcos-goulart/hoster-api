import "dotenv/config";
import app from "./app";

// Garante fallback caso NODE_ENV esteja undefined
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running in [${process.env.NODE_ENV}] mode on http://localhost:${PORT}`,
  );
  console.log(`📡 Healthcheck route: http://localhost:${PORT}/api/health\n`);
});
