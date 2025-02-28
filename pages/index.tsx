// pages/index.tsx

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';
import QuotationForm from '../components/QuotationForm';
import { checkUserSession, clearUserSession } from '../utils/auth';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = checkUserSession();
    setUsername(savedUsername);
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUsername: string) => {
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    clearUserSession();
    setUsername(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {!username ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <QuotationForm 
            username={username} 
            onLogout={handleLogout}
          />
        )}
      </div>
    </Layout>
  );
}