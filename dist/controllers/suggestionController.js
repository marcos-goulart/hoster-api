"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionController = void 0;
const suggestionService_1 = require("../services/suggestionService");
const suggestionService = new suggestionService_1.SuggestionService();
class SuggestionController {
    async getSuggestions(req, res) {
        try {
            const query = req.query.q || req.query.query || "";
            const suggestions = await suggestionService.getSuggestions(query);
            res.status(200).json(suggestions);
        }
        catch (error) {
            console.error("❌ Erro ao buscar sugestões:", error);
            res.status(500).json({ error: "Erro ao carregar sugestões de destino." });
        }
    }
}
exports.SuggestionController = SuggestionController;
