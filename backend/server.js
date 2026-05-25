import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import analyzeRouter from './routes/analyze.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/analyze', analyzeRouter);

function getPublicErrorMessage(error) {
  const message = error?.message || '';

  if (message.includes('GEMINI_API_KEY is not configured')) {
    return 'Gemini API key is not configured on the backend.';
  }

  if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
    return 'Gemini API key is invalid. Check the backend environment variable.';
  }

  if (message.includes('not found for API version') || message.includes('is not supported for generateContent')) {
    return 'Configured Gemini model is unavailable for this API key.';
  }

  if (message.includes('429') || message.toLowerCase().includes('quota')) {
    return 'Gemini quota or rate limit was reached. Try again later.';
  }

  if (message.includes('Invalid JSON returned from Gemini')) {
    return 'Gemini returned an invalid response format. Try a smaller query or schema.';
  }

  if (message.includes('Empty response returned from Gemini')) {
    return 'Gemini returned an empty response. Try again.';
  }

  return 'Unable to analyze query';
}

app.use((error, _request, response, _next) => {
  console.error(error?.stack || error);
  response.status(500).json({
    error: true,
    message: getPublicErrorMessage(error),
  });
});

app.listen(port, () => {
  console.log(`AI Query Optimizer API running on port ${port}`);
});
