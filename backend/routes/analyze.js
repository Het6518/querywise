import express from 'express';
import { analyzeQueryWithGemini } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (request, response, next) => {
  try {
    const { schema = '', query = '' } = request.body || {};

    if (!schema.trim() || !query.trim()) {
      return response.status(400).json({
        error: true,
        message: 'Schema and query are required.',
      });
    }

    const result = await analyzeQueryWithGemini({ schema, query });
    return response.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
