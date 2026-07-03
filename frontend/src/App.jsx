import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from './layouts/MainLayout';
import IdeaInputPage from './pages/IdeaInputPage';
import DashboardPage from './pages/DashboardPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import GithubCallback from './pages/GithubCallback';
import ChatsPage from './pages/ChatsPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';

import { useStore } from './store/useStore';

function App() {
  const GOOGLE_CLIENT_ID = "354521492969-r590crs4mk6j6b9pn8lj7c9bo91r1phc.apps.googleusercontent.com";
  const { checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes>
        {/* Auth Pages (No Sidebar/Chat) */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/github/callback" element={<GithubCallback />} />

        {/* Main App Pages (With Sidebar/Chat) */}
        <Route path="/" element={<MainLayout><IdeaInputPage /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/dashboard/:id" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/chats" element={<MainLayout><ChatsPage /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
        <Route path="/support" element={<MainLayout><SupportPage /></MainLayout>} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
