import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Healthcheck route: http://localhost:${PORT}/api/health\n`);
});
