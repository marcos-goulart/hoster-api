import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasFirebaseCredentials = Boolean(projectId && clientEmail && privateKey);

if (!hasFirebaseCredentials) {
  console.warn(
    "⚠️ As variáveis de ambiente do Firebase Admin não foram totalmente configuradas.",
  );
}

if (!getApps().length && hasFirebaseCredentials) {
  initializeApp({
    credential: cert({
      projectId: projectId!,
      clientEmail: clientEmail!,
      privateKey: privateKey!,
    }),
  });
}

// Retorna a instância do Auth apenas se o app do Firebase foi inicializado
export const firebaseAuth = getApps().length
  ? getAuth()
  : (null as unknown as ReturnType<typeof getAuth>);
