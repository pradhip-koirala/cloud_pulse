import { useState, useEffect } from 'react';
import { getTests, getStats, deleteTest } from '../services/api';
import StatCard from '../components/StatCard';
import LineLatencyChart from '../charts/LineLatencyChart';
import BarComparisonChart from '../charts/BarComparisonChart';
import ResultTable from '../components/ResultTable';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [allTests, setAllTests] = useState([]);
  const [uniqueUrls, setUniqueUrls] = useState([]);
  const [urlStats, setUrlStats] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedUrlData, setSelectedUrlData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      loadUrlData(selectedUrl);
    }
  }, [selectedUrl]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get all tests
      const testsData = await getTests({ limit: 100 });
      setAllTests(testsData.results);

      // Extract unique URLs
      const urls = [...new Set(testsData.results.map(t => t.url))];
      setUniqueUrls(urls);

      // Get stats for each unique URL
      const statsPromises = urls.map(url => getStats(url));
      const stats = await Promise.all(statsPromises);
      setUrlStats(stats.filter(s => s.count > 0));

      // Select first URL by default
      if (urls.length > 0) {
        setSelectedUrl(urls[0]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUrlData = async (url) => {
    try {
      const data = await getTests({ url, limit: 50 });
      // Filter only successful tests for the chart
      const successfulTests = data.results.filter(t => t.responseTime !== null);
      setSelectedUrlData(successfulTests.reverse()); // Oldest first for timeline
    } catch (error) {
      console.error('Failed to load URL data:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteTest(id);
        await loadDashboardData();
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('Failed to delete record');
      }
    }
  };

  // Calculate overall stats
  const successfulTests = allTests.filter(t => t.responseTime !== null);
  const totalTests = allTests.length;
  const avgLatency = successfulTests.length > 0
    ? (successfulTests.reduce((sum, t) => sum + t.responseTime, 0) / successfulTests.length).toFixed(1)
    : null;
  const minLatency = successfulTests.length > 0
    ? Math.min(...successfulTests.map(t => t.responseTime))
    : null;
  const maxLatency = successfulTests.length > 0
    ? Math.max(...successfulTests.map(t => t.responseTime))
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (allTests.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">No test data yet</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800 mb-4">Run your first latency test to see analytics here!</p>
          <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Analytics and insights from your latency tests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tests"
          value={totalTests}
          color="blue"
          icon="📊"
        />
        <StatCard
          title="Average Latency"
          value={avgLatency}
          unit="ms"
          color="green"
          icon="⚡"
        />
        <StatCard
          title="Fastest Response"
          value={minLatency}
          unit="ms"
          color="green"
          icon="🚀"
        />
        <StatCard
          title="Slowest Response"
          value={maxLatency}
          unit="ms"
          color="yellow"
          icon="🐌"
        />
      </div>

      {/* URL Selector */}
      {uniqueUrls.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select URL to analyze
          </label>
          <select
            value={selectedUrl || ''}
            onChange={(e) => setSelectedUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {uniqueUrls.map(url => (
              <option key={url} value={url}>{url}</option>
            ))}
          </select>
        </div>
      )}

      {/* Line Chart */}
      {selectedUrlData.length > 0 && (
        <LineLatencyChart
          data={selectedUrlData}
          title={`Latency Trend for ${selectedUrl}`}
        />
      )}

      {/* Bar Chart */}
      {urlStats.length > 0 && (
        <BarComparisonChart
          stats={urlStats}
          title="URL Performance Comparison"
        />
      )}

      {/* History Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Test History</h2>
        <ResultTable results={allTests} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Dashboard;
