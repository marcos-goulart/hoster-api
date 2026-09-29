import { Router } from "express";
import { UserController } from "../controllers/userController";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/authMiddleware";

const router = Router();
const userController = new UserController();

router.use(authMiddleware as any);

router.get("/favorites", (req, res) =>
  userController.getFavorites(req as AuthenticatedRequest, res),
);
router.post("/favorites", (req, res) =>
  userController.addFavorite(req as AuthenticatedRequest, res),
);
router.delete("/favorites/:hotelId", (req, res) =>
  userController.removeFavorite(req as AuthenticatedRequest, res),
);

export default router;
