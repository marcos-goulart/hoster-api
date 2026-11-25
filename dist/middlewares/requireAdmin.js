"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const prisma_1 = require("../config/prisma");
async function requireAdmin(req, res, next) {
    const uid = req.user?.uid;
    if (!uid) {
        res.status(401).json({
            success: false,
            error: "Token de autenticação não fornecido ou inválido.",
        });
        return;
    }
    try {
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ id: uid }, { firebaseUid: uid }],
            },
            select: {
                role: true,
            },
        });
        if (!user || user.role !== "ADMIN") {
            res.status(403).json({
                success: false,
                error: "Acesso negado. Apenas administradores podem executar esta ação.",
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error("❌ Erro no middleware requireAdmin:", error);
        res.status(500).json({
            success: false,
            error: "Erro ao verificar permissões de administrador.",
        });
    }
}
