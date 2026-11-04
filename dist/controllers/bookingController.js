"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const bookingService_1 = require("../services/bookingService");
const bookingService = new bookingService_1.BookingService();
class BookingController {
    async create(req, res) {
        try {
            const userId = req.user.uid;
            const userEmail = req.user.email;
            const booking = await bookingService.createBooking({
                userId,
                userEmail,
                ...req.body,
            });
            res.status(201).json({ success: true, data: booking });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "Erro ao processar reserva.",
            });
        }
    }
    async listMyBookings(req, res) {
        try {
            const userId = req.user.uid;
            const bookings = await bookingService.getUserBookings(userId);
            res.status(200).json({ success: true, data: bookings });
        }
        catch (error) {
            res
                .status(500)
                .json({
                success: false,
                error: "Erro ao carregar histórico de viagens",
            });
        }
    }
}
exports.BookingController = BookingController;
