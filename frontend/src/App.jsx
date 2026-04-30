import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import IdeaInputPage from './pages/IdeaInputPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking connection...');

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.message || 'Connected!'))
      .catch((err) => setBackendStatus('Disconnected'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI Copilot</span>
              </div>
              <div className="ml-8 flex items-center space-x-6">
                <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Idea Input</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${backendStatus === 'Disconnected' ? 'text-red-500' : backendStatus === 'Checking connection...' ? 'text-yellow-500' : 'text-green-500'}`}>
                Backend: {backendStatus}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<IdeaInputPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
