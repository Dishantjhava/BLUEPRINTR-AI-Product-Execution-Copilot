import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import IdeaInputPage from './pages/IdeaInputPage';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Routes>
      {/* Auth Pages (No Sidebar/Chat) */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Main App Pages (With Sidebar/Chat) */}
      <Route path="/" element={<MainLayout><IdeaInputPage /></MainLayout>} />
      <Route path="/dashboard/*" element={<MainLayout><DashboardPage /></MainLayout>} />
    </Routes>
  );
}

export default App;
