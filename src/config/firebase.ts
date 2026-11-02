import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

const isTestEnv = process.env.NODE_ENV === "test";
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasCredentials = Boolean(projectId && clientEmail && privateKey);

if (!getApps().length) {
  if (isTestEnv) {
    // Em ambiente de testes do Vitest, inicializamos com projeto mock para evitar parse de chave RSA
    initializeApp({ projectId: projectId || "test-project" });
  } else if (hasCredentials) {
    initializeApp({
      credential: cert({
        projectId: projectId!,
        clientEmail: clientEmail!,
        privateKey: privateKey!,
      }),
    });
  } else {
    console.warn(
      "⚠️ As variáveis de ambiente do Firebase Admin não foram totalmente configuradas.",
    );
  }
}

export const firebaseAuth = getApps().length
  ? getAuth()
  : (null as unknown as ReturnType<typeof getAuth>);
