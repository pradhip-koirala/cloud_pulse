import { formatMs, formatBytes, formatTimestamp, getStatusColor, getLatencyColor } from '../utils/formatters';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const statusColor = getStatusColor(result.statusCode, result.errorType);
  const latencyColor = getLatencyColor(result.responseTime);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Test Result</h2>
      
      <div className="space-y-4">
        {/* URL */}
        <div>
          <span className="text-sm font-medium text-gray-500">URL</span>
          <p className="text-gray-800 break-all">{result.url}</p>
        </div>

        {/* Status */}
        <div>
          <span className="text-sm font-medium text-gray-500">Status</span>
          <div className="mt-1">
            {result.errorType ? (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                Error: {result.errorType}
              </span>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                {result.statusCode}
              </span>
            )}
          </div>
        </div>

        {/* Response Time */}
        <div>
          <span className="text-sm font-medium text-gray-500">Response Time</span>
          <p className={`text-2xl font-bold ${latencyColor}`}>
            {formatMs(result.responseTime)}
          </p>
        </div>

        {/* Response Size */}
        <div>
          <span className="text-sm font-medium text-gray-500">Response Size</span>
          <p className="text-gray-800">{formatBytes(result.responseSize)}</p>
        </div>

        {/* Timestamp */}
        <div>
          <span className="text-sm font-medium text-gray-500">Tested At</span>
          <p className="text-gray-800">{formatTimestamp(result.timestamp)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
