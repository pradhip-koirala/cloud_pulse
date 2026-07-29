import mongoose from 'mongoose';

const latencyLogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  responseTime: {
    type: Number,
    default: null // null if request failed
  },
  statusCode: {
    type: Number,
    default: null // null if request failed before response
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true // Index for faster queries
  },
  responseSize: {
    type: Number,
    default: null // bytes, from content-length header
  },
  provider: {
    type: String,
    default: null // reserved for future auto-detection
  },
  errorType: {
    type: String,
    enum: ['timeout', 'dns', 'refused', 'invalid_url', 'network_error', null],
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Compound index for efficient querying by URL and timestamp
latencyLogSchema.index({ url: 1, timestamp: -1 });

const LatencyLog = mongoose.model('LatencyLog', latencyLogSchema);

export default LatencyLog;
