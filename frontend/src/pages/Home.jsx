import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import URLInput from '../components/URLInput';
import ResultCard from '../components/ResultCard';
import ResultTable from '../components/ResultTable';
import { runTest, getTests } from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestResult, setLatestResult] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const navigate = useNavigate();

  // Load recent tests on mount
  useEffect(() => {
    loadRecentTests();
  }, []);

  const loadRecentTests = async () => {
    try {
      const data = await getTests({ limit: 10 });
      setRecentTests(data.results);
    } catch (err) {
      console.error('Failed to load recent tests:', err);
    }
  };

  const handleSubmit = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const result = await runTest(url);
      setLatestResult(result);
      
      // Refresh recent tests
      await loadRecentTests();
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to run test. Please try again.';
      setError(errorMessage);
      console.error('Test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Test Your Website Latency
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Enter a URL to measure response time, status, and size
        </p>
      </div>

      {/* URL Input */}
      <div className="max-w-3xl mx-auto">
        <URLInput onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm sm:text-base text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Latest Result */}
      {latestResult && (
        <div className="max-w-3xl mx-auto">
          <ResultCard result={latestResult} />
        </div>
      )}

      {/* Recent Tests */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Tests</h2>
          {recentTests.length > 0 && (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium"
            >
              View Dashboard →
            </button>
          )}
        </div>
        <ResultTable results={recentTests} />
      </div>
    </div>
  );
};

export default Home;
