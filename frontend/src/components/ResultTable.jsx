import { formatMs, formatBytes, formatTimestamp, getStatusColor } from '../utils/formatters';

const ResultTable = ({ results, onDelete }) => {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-200">
        <p className="text-sm sm:text-base text-gray-500">No test results yet. Run your first test above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              {onDelete && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => {
              const statusColor = getStatusColor(result.statusCode, result.errorType);
              return (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {result.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.errorType ? (
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
                        {result.errorType}
                      </span>
                    ) : (
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
                        {result.statusCode}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatMs(result.responseTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatBytes(result.responseSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(result.timestamp)}
                  </td>
                  {onDelete && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onDelete(result.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        aria-label={`Delete test result for ${result.url}`}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {results.map((result) => {
          const statusColor = getStatusColor(result.statusCode, result.errorType);
          return (
            <div key={result.id} className="p-4 hover:bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-gray-900 break-all flex-1">
                    {result.url}
                  </span>
                  {result.errorType ? (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusColor}`}>
                      {result.errorType}
                    </span>
                  ) : (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusColor}`}>
                      {result.statusCode}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Latency: <strong className="text-gray-900">{formatMs(result.responseTime)}</strong></span>
                  <span>Size: <strong className="text-gray-900">{formatBytes(result.responseSize)}</strong></span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatTimestamp(result.timestamp)}</span>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(result.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      aria-label={`Delete test result for ${result.url}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultTable;
