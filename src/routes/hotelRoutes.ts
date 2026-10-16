import { Router } from "express";
import { HotelController } from "../controllers/hotelController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const hotelController = new HotelController();

router.get("/", (req, res) => hotelController.getHotels(req, res));
router.get("/:id", (req, res) => hotelController.getHotelById(req, res));

router.post("/:id/questions", authMiddleware, (req, res) =>
  hotelController.addQuestion(req, res),
);
export default router;
