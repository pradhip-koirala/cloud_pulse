import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Compare from './pages/Compare'

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    return `px-3 py-2 sm:px-4 rounded-md font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className="flex gap-1 sm:gap-2" role="navigation" aria-label="Main navigation">
      <Link to="/" className={linkClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
        Home
      </Link>
      <Link to="/dashboard" className={linkClass('/dashboard')} aria-current={isActive('/dashboard') ? 'page' : undefined}>
        Dashboard
      </Link>
      <Link to="/compare" className={linkClass('/compare')} aria-current={isActive('/compare') ? 'page' : undefined}>
        Compare
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CloudPulse</h1>
                <p className="text-xs sm:text-sm text-gray-500">Latency Monitoring & Performance Analysis</p>
              </div>
              <Navigation />
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8" role="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs sm:text-sm text-gray-500">
              CloudPulse - Monitor your cloud services with ease
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
