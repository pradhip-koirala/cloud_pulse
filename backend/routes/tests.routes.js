import express from 'express';
import { runTest, getTests, deleteTest, getStats } from '../controllers/tests.controller.js';
import { validateUrl } from '../middleware/validateUrl.js';

const router = express.Router();

// POST /api/tests - Run a latency test
router.post('/tests', validateUrl, runTest);

// GET /api/tests - Get test history (with optional url, page, limit params)
router.get('/tests', getTests);

// DELETE /api/tests/:id - Delete a test record
router.delete('/tests/:id', deleteTest);

// GET /api/stats - Get statistics for a URL
router.get('/stats', getStats);

export default router;
