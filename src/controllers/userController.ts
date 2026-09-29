import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async getFavorites(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      const favorites = await userService.getFavorites(userId);
      res.status(200).json({ success: true, data: favorites });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Erro ao carregar favoritos." });
    }
  }

  async addFavorite(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { hotelId } = req.body;
      const favorite = await userService.addFavorite(userId, hotelId);
      res.status(201).json({ success: true, data: favorite });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Erro ao adicionar favorito" });
    }
  }

  async removeFavorite(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { hotelId } = req.params;
      await userService.removeFavorite(userId, String(hotelId));
      res
        .status(200)
        .json({ success: true, message: "Favorito removido com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Erro ao remover favorito" });
    }
  }
}
