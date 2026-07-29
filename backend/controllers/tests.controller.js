import { measureLatency } from '../services/latency.service.js';
import LatencyLog from '../models/LatencyLog.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Run a latency test for a URL
 * POST /api/tests
 */
export const runTest = async (req, res, next) => {
  try {
    const url = req.normalizedUrl; // Set by validateUrl middleware
    
    // Measure latency
    const result = await measureLatency(url);
    
    // Save to database
    const savedLog = await LatencyLog.create(result);
    
    // Return the saved result with MongoDB _id as id
    res.status(200).json({
      id: savedLog._id.toString(),
      url: savedLog.url,
      responseTime: savedLog.responseTime,
      statusCode: savedLog.statusCode,
      responseSize: savedLog.responseSize,
      timestamp: savedLog.timestamp,
      errorType: savedLog.errorType
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get test history
 * GET /api/tests?url=<url>&page=<page>&limit=<limit>
 */
export const getTests = async (req, res, next) => {
  try {
    const { url, page = 1, limit = 20 } = req.query;
    
    const query = url ? { url } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [results, total] = await Promise.all([
      LatencyLog.find(query)
        .sort({ timestamp: -1 }) // newest first
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      LatencyLog.countDocuments(query)
    ]);
    
    // Transform _id to id for consistent API
    const transformedResults = results.map(log => ({
      id: log._id.toString(),
      url: log.url,
      responseTime: log.responseTime,
      statusCode: log.statusCode,
      responseSize: log.responseSize,
      timestamp: log.timestamp,
      errorType: log.errorType
    }));
    
    res.status(200).json({
      results: transformedResults,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a test record
 * DELETE /api/tests/:id
 */
export const deleteTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedLog = await LatencyLog.findByIdAndDelete(id);
    
    if (!deletedLog) {
      throw new AppError('Record not found', 404, 'NOT_FOUND');
    }
    
    res.status(200).json({
      success: true,
      id: deletedLog._id.toString()
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid record ID', 400, 'INVALID_ID'));
    }
    next(error);
  }
};

/**
 * Get statistics for a URL
 * GET /api/stats?url=<url>
 */
export const getStats = async (req, res, next) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      throw new AppError('URL parameter is required', 400, 'MISSING_PARAMETER');
    }
    
    const logs = await LatencyLog.find({ 
      url, 
      responseTime: { $ne: null } // Only successful requests
    }).lean();
    
    if (logs.length === 0) {
      return res.status(200).json({
        url,
        average: null,
        min: null,
        max: null,
        count: 0
      });
    }
    
    const responseTimes = logs.map(log => log.responseTime);
    const average = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const min = Math.min(...responseTimes);
    const max = Math.max(...responseTimes);
    
    res.status(200).json({
      url,
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      min,
      max,
      count: logs.length
    });
  } catch (error) {
    next(error);
  }
};
