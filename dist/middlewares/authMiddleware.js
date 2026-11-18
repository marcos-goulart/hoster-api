"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const firebase_1 = require("../config/firebase");
async function authMiddleware(req, res, next) {
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
        const decodedToken = await firebase_1.firebaseAuth.verifyIdToken(token);
        // Validação de e-mail verificado para provedor de senha
        if (decodedToken.firebase.sign_in_provider === "password" &&
            !decodedToken.email_verified) {
            res.status(403).json({
                success: false,
                error: "Acesso não autorizado. A conta de e-mail ainda não foi verificada.",
            });
            return;
        }
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
        };
        next();
    }
    catch (error) {
        console.error("❌ Erro na validação do token Firebase:", error);
        res.status(401).json({
            success: false,
            error: "Acesso não autorizado. Token expirado ou inválido.",
        });
    }
}
