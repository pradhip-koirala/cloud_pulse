import { useState } from 'react';
import { runTest } from '../services/api';
import { formatMs, formatBytes, getStatusColor, getLatencyColor } from '../utils/formatters';

const Compare = () => {
  const [urls, setUrls] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    if (urls.length < 10) {
      setUrls([...urls, '']);
    }
  };

  const handleRemoveUrl = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      const newResults = results.filter((_, i) => i !== index);
      setResults(newResults);
    }
  };

  const handleRunTests = async () => {
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const testPromises = validUrls.map(url => runTest(url.trim()));
      const testResults = await Promise.all(testPromises);
      setResults(testResults);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to run tests. Please try again.';
      setError(errorMessage);
      console.error('Tests failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Find fastest and slowest
  const successfulResults = results.filter(r => r.responseTime !== null);
  const fastestIndex = successfulResults.length > 0
    ? results.findIndex(r => r.responseTime === Math.min(...successfulResults.map(r => r.responseTime)))
    : -1;
  const slowestIndex = successfulResults.length > 0
    ? results.findIndex(r => r.responseTime === Math.max(...successfulResults.map(r => r.responseTime)))
    : -1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Compare URLs
        </h1>
        <p className="text-gray-600">
          Test multiple URLs side-by-side to compare their performance
        </p>
      </div>

      {/* URL Inputs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter URLs to Compare</h2>
        <div className="space-y-3">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-12 text-gray-500 font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder={`Enter URL ${index + 1} (e.g., https://example.com)`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              {urls.length > 1 && (
                <button
                  onClick={() => handleRemoveUrl(index)}
                  disabled={loading}
                  className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={`Remove URL ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          {urls.length < 10 && (
            <button
              onClick={handleAddUrl}
              disabled={loading}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 border border-blue-300 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              + Add URL
            </button>
          )}
          <button
            onClick={handleRunTests}
            disabled={loading || urls.filter(u => u.trim()).length === 0}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Testing All URLs...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparison Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => {
              const statusColor = getStatusColor(result.statusCode, result.errorType);
              const latencyColor = getLatencyColor(result.responseTime);
              const isFastest = index === fastestIndex;
              const isSlowest = index === slowestIndex;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md border-2 p-6 relative ${
                    isFastest ? 'border-green-500' : isSlowest ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  {isFastest && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      🏆 FASTEST
                    </div>
                  )}
                  {isSlowest && successfulResults.length > 1 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      🐌 SLOWEST
                    </div>
                  )}

                  <div className="space-y-4 mt-2">
                    {/* URL */}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">URL</span>
                      <p className="text-sm text-gray-800 break-all font-medium">{result.url}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                      <div className="mt-1">
                        {result.errorType ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            Error: {result.errorType}
                          </span>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            {result.statusCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Response Time */}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Response Time</span>
                      <p className={`text-3xl font-bold ${latencyColor}`}>
                        {formatMs(result.responseTime)}
                      </p>
                    </div>

                    {/* Response Size */}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Size</span>
                      <p className="text-sm text-gray-800">{formatBytes(result.responseSize)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Table */}
          {successfulResults.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">Fastest Response</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">
                        {formatMs(Math.min(...successfulResults.map(r => r.responseTime)))}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">Slowest Response</td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">
                        {formatMs(Math.max(...successfulResults.map(r => r.responseTime)))}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">Average Response</td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                        {formatMs((successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length).toFixed(1))}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">Difference (Fastest vs Slowest)</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatMs(Math.max(...successfulResults.map(r => r.responseTime)) - Math.min(...successfulResults.map(r => r.responseTime)))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Compare;
