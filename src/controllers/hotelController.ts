// src/controllers/hotelController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { HotelService } from "../services/hotelService";

const hotelService = new HotelService();

export class HotelController {
  async getHotels(req: Request, res: Response): Promise<void> {
    try {
      const { city, minPrice, maxPrice, guests, amenities } = req.query;

      const parsedAmenities = amenities
        ? Array.isArray(amenities)
          ? (amenities as string[])
          : (amenities as string).split(",")
        : undefined;

      const result = await hotelService.listHotels({
        city: city as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        guests: guests ? Number(guests) : undefined,
        amenities: parsedAmenities,
      });

      res.status(200).json({
        success: true,
        count: result.hotels.length,
        searchScope: result.searchScope,
        searchTerm: result.searchTerm,
        data: result.hotels,
      });
    } catch (error) {
      console.error("❌ Erro ao buscar hotéis:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao carregar a lista de hotéis.",
      });
    }
  }

  async getHotelById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const hotel = await hotelService.getHotelById(String(id));

      if (!hotel) {
        res.status(404).json({
          success: false,
          error: "Acomodação não encontrada.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      console.error("❌ Erro ao buscar detalhes do hotel:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao carregar detalhes do hotel.",
      });
    }
  }

  async addQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: hotelId } = req.params;
      const { question } = req.body;
      const userId = req.user!.uid;
      const userName =
        req.user!.name || req.user!.email?.split("@")[0] || "Hóspede";
      const userAvatar = req.user!.picture || null;

      if (!question || typeof question !== "string" || !question.trim()) {
        res.status(400).json({
          success: false,
          error: "A pergunta deve ser informada e não pode estar vazia.",
        });
        return;
      }

      const newQuestion = await hotelService.createQuestion({
        hotelId: String(hotelId),
        userId,
        userName,
        userAvatar,
        question: question.trim(),
      });

      res.status(201).json({
        success: true,
        data: newQuestion,
      });
    } catch (error) {
      console.error("❌ Erro ao registrar pergunta:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao enviar sua dúvida sobre o hotel",
      });
    }
  }
}
