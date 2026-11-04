"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
require("dotenv/config");
const isTestEnv = process.env.NODE_ENV === "test";
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const hasCredentials = Boolean(projectId && clientEmail && privateKey);
if (!(0, app_1.getApps)().length) {
    if (isTestEnv) {
        // Em ambiente de testes do Vitest, inicializamos com projeto mock para evitar parse de chave RSA
        (0, app_1.initializeApp)({ projectId: projectId || "test-project" });
    }
    else if (hasCredentials) {
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId: projectId,
                clientEmail: clientEmail,
                privateKey: privateKey,
            }),
        });
    }
    else {
        console.warn("⚠️ As variáveis de ambiente do Firebase Admin não foram totalmente configuradas.");
    }
}
exports.firebaseAuth = (0, app_1.getApps)().length
    ? (0, auth_1.getAuth)()
    : null;
