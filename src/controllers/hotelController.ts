import { Request, Response } from "express";
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

      const hotels = await hotelService.listHotels({
        city: city as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        guests: guests ? Number(guests) : undefined,
        amenities: parsedAmenities,
      });

      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels,
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
      const hotelId = String(id);
      const hotel = await hotelService.getHotelById(hotelId);

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
}
