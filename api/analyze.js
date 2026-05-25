import { analyzeQueryWithGemini } from '../backend/services/geminiService.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: true,
      message: 'Method not allowed.',
    });
  }

  try {
    const { schema = '', query = '' } = request.body || {};

    if (!schema.trim() || !query.trim()) {
      return response.status(400).json({
        error: true,
        message: 'Schema and query are required.',
      });
    }

    const result = await analyzeQueryWithGemini({ schema, query });
    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      error: true,
      message: 'Unable to analyze query',
    });
  }
}
