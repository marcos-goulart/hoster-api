"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
class UserController {
    async getFavorites(req, res) {
        try {
            const userId = req.user.uid;
            const favorites = await userService.getFavorites(userId);
            res.status(200).json({ success: true, data: favorites });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: "Erro ao carregar favoritos." });
        }
    }
    async addFavorite(req, res) {
        try {
            const userId = req.user.uid;
            const { hotelId } = req.body;
            const favorite = await userService.addFavorite(userId, hotelId);
            res.status(201).json({ success: true, data: favorite });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: "Erro ao adicionar favorito" });
        }
    }
    async removeFavorite(req, res) {
        try {
            const userId = req.user.uid;
            const { hotelId } = req.params;
            await userService.removeFavorite(userId, String(hotelId));
            res
                .status(200)
                .json({ success: true, message: "Favorito removido com sucesso" });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: "Erro ao remover favorito" });
        }
    }
}
exports.UserController = UserController;
