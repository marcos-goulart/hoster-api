import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Token de autenticação não fornecido ou inválido.",
    });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error("❌ Erro na validação do token Firebase:", error);
    res.status(401).json({
      success: false,
      error: "Acesso não autorizado. Token expirado ou inválido.",
    });
  }
}
