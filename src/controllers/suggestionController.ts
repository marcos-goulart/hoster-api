import { Request, Response } from "express";
import { SuggestionService } from "../services/suggestionService";

const suggestionService = new SuggestionService();

export class SuggestionController {
  async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const query =
        (req.query.q as string) || (req.query.query as string) || "";
      const suggestions = await suggestionService.getSuggestions(query);
      res.status(200).json(suggestions);
    } catch (error) {
      console.error("❌ Erro ao buscar sugestões:", error);
      res.status(500).json({ error: "Erro ao carregar sugestões de destino." });
    }
  }
}
