"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
// Garante fallback caso NODE_ENV esteja undefined
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3001;
app_1.default.listen(PORT, () => {
    console.log(`\n🚀 Server running in [${process.env.NODE_ENV}] mode on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck route: http://localhost:${PORT}/api/health\n`);
});
