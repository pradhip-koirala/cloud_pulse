import { useState } from 'react';

const URLInput = ({ onSubmit, loading = false }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="url-input" className="sr-only">
          URL to test
        </label>
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
          disabled={loading}
          required
          aria-required="true"
          aria-invalid={false}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          aria-label={loading ? 'Testing URL...' : 'Analyze URL'}
        >
          {loading ? 'Testing...' : 'Analyze'}
        </button>
      </div>
    </form>
  );
};

export default URLInput;
