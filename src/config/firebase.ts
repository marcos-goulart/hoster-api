import { initializeApp, getApps, cert } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.warn(
    "⚠️ As variáveis de ambiente do Firebase Admin não foram totalmente configuradas.",
  );
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const firebaseAuth = getAuth();
