/**
 * Format milliseconds for display
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted string
 */
export const formatMs = (ms) => {
  if (ms === null || ms === undefined) return 'N/A';
  return `${ms} ms`;
};

/**
 * Format bytes for display
 * @param {number} bytes - Bytes
 * @returns {string} Formatted string
 */
export const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined) return 'N/A';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

/**
 * Get status badge color based on status code or error
 * @param {number} statusCode - HTTP status code
 * @param {string} errorType - Error type
 * @returns {string} Tailwind color class
 */
export const getStatusColor = (statusCode, errorType) => {
  if (errorType) return 'bg-red-100 text-red-800';
  if (!statusCode) return 'bg-gray-100 text-gray-800';
  if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
  if (statusCode >= 300 && statusCode < 400) return 'bg-blue-100 text-blue-800';
  if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800';
  if (statusCode >= 500) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

/**
 * Get latency color based on response time
 * @param {number} responseTime - Response time in ms
 * @returns {string} Tailwind color class
 */
export const getLatencyColor = (responseTime) => {
  if (responseTime === null || responseTime === undefined) return 'text-gray-500';
  if (responseTime < 100) return 'text-green-600';
  if (responseTime < 300) return 'text-yellow-600';
  if (responseTime < 1000) return 'text-orange-600';
  return 'text-red-600';
};
