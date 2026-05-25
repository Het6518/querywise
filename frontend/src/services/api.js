import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://query-optimizer-backend.onrender.com' : 'http://localhost:5000'),
  timeout: 60000,
});

export async function analyzeQuery(payload) {
  const { data } = await api.post('/analyze', payload);
  return data;
}
