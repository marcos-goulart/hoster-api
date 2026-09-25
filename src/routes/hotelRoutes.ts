import { Router } from "express";
import { HotelController } from "../controllers/hotelController";

const router = Router();
const hotelController = new HotelController();

router.get("/", (req, res) => hotelController.getHotels(req, res));
router.get("/:id", (req, res) => hotelController.getHotelById(req, res));

export default router;
