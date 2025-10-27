/**
 * Main API router for HireFlow AI backend
 * @module routes/index
 */
import { Router } from 'express';

const router = Router();

// Placeholder route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the HireFlow AI API!' });
});

export default router;
