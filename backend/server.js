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

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    error: true,
    message: 'Unable to analyze query',
  });
});

app.listen(port, () => {
  console.log(`AI Query Optimizer API running on port ${port}`);
});
