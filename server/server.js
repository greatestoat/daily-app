import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import taskRoutes from './routes/tasks.js';

dotenv.config();
const app = express();

const origins = (process.env.CLIENT_URL || '*').split(',').map((s) => s.trim());
app.use(cors({ origin: origins.includes('*') ? '*' : origins }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/tasks', taskRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing. Copy .env.example to .env');
  process.exit(1);
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API running on :${PORT}`)))
  .catch((e) => { console.error('Mongo connection failed', e.message); process.exit(1); });
