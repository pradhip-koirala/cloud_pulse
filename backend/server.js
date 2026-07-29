import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testsRoutes from './routes/tests.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDatabase } from './config/database.dev.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', testsRoutes);

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
