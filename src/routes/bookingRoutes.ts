import { Router } from "express";
import { BookingController } from "../controllers/bookingController";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/authMiddleware";

const router = Router();
const bookingController = new BookingController();

router.use(authMiddleware as any);

router.post("/", (req, res) =>
  bookingController.create(req as AuthenticatedRequest, res),
);
router.get("/my-bookings", (req, res) =>
  bookingController.listMyBookings(req as AuthenticatedRequest, res),
);

export default router;
