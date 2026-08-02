import axios from 'axios';

// Force production API URL if no env var is set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://cloud-pulse-40uq.onrender.com/api' 
    : 'http://localhost:5000/api');

// Debug logging
console.log('🔧 API Configuration:');
console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('  API_BASE_URL:', API_BASE_URL);
console.log('  Mode:', import.meta.env.MODE);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Run a latency test for a URL
 * @param {string} url - The URL to test
 * @returns {Promise} Test result
 */
export const runTest = async (url) => {
  const response = await apiClient.post('/tests', { url });
  return response.data;
};

/**
 * Get test history
 * @param {Object} params - Query parameters (url, page, limit)
 * @returns {Promise} Test history
 */
export const getTests = async (params = {}) => {
  const response = await apiClient.get('/tests', { params });
  return response.data;
};

/**
 * Delete a test record
 * @param {string} id - Test record ID
 * @returns {Promise} Deletion result
 */
export const deleteTest = async (id) => {
  const response = await apiClient.delete(`/tests/${id}`);
  return response.data;
};

/**
 * Get statistics for a URL
 * @param {string} url - The URL to get stats for
 * @returns {Promise} Statistics
 */
export const getStats = async (url) => {
  const response = await apiClient.get('/stats', { params: { url } });
  return response.data;
};

export default apiClient;
