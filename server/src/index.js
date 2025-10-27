import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { PORT } from './config.js';
import apiRouter from './routes/index.js';
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
