import axios from 'axios';

const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS) || 10000;

/**
 * Measure latency for a given URL
 * @param {string} url - The URL to test
 * @returns {Object} Test result with responseTime, statusCode, responseSize, errorType
 */
export const measureLatency = async (url) => {
  const startTime = Date.now();
  const result = {
    url,
    responseTime: null,
    statusCode: null,
    responseSize: null,
    timestamp: new Date().toISOString(),
    errorType: null
  };

  try {
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT,
      maxRedirects: 5,
      validateStatus: () => true, // Accept any status code
      // Don't follow redirects to potentially unsafe locations
      beforeRedirect: (options) => {
        // Additional SSRF check on redirects
        const redirectUrl = new URL(options.href);
        const hostname = redirectUrl.hostname.toLowerCase();
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
          throw new Error('Redirect to disallowed host');
        }
      }
    });

    const endTime = Date.now();
    
    result.responseTime = endTime - startTime;
    result.statusCode = response.status;
    result.responseSize = parseInt(response.headers['content-length']) || 
                         (response.data ? JSON.stringify(response.data).length : 0);
    
  } catch (error) {
    const endTime = Date.now();
    
    // Categorize the error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      result.errorType = 'timeout';
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      result.errorType = 'dns';
    } else if (error.code === 'ECONNREFUSED') {
      result.errorType = 'refused';
    } else if (error.message.includes('disallowed')) {
      result.errorType = 'invalid_url';
    } else {
      result.errorType = 'network_error';
    }
    
    // Record the time even for failures (useful for timeout duration)
    if (result.errorType === 'timeout') {
      result.responseTime = endTime - startTime;
    }
  }

  return result;
};
