import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { BookingService } from "../services/bookingService";

const bookingService = new BookingService();

export class BookingController {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      const userEmail = req.user!.email;

      const booking = await bookingService.createBooking({
        userId,
        userEmail,
        ...req.body,
      });

      res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || "Erro ao processar reserva.",
      });
    }
  }

  async listMyBookings(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user!.uid;
      const bookings = await bookingService.getUserBookings(userId);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Erro ao carregar histórico de viagens",
        });
    }
  }
}
