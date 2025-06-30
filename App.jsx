import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ NEW

import HomePage from './page/HomePage';
import HealthcarePage from './page/HealthcarePage';
import EducationPage from './page/EducationPage';
import ImageEditingPage from './page/ImageEditingPage';
import AboutPage from './page/AboutPage';
import AuthPage from './page/AuthPage';
import LoginSuccess from './page/LoginSuccess';
import CommunityPage from './page/CommunityPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home-page');
  const [user, setUser] = useState(null);

  // ✅ Load full user info on mount
  useEffect(() => {
    const token = localStorage.getItem('medhavi-token');
    const userStr = localStorage.getItem('medhavi-user');

    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch {
        console.error("❌ Invalid user data");
        localStorage.removeItem('medhavi-token');
        localStorage.removeItem('medhavi-user');
      }
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home-page':
        return <HomePage setCurrentPage={setCurrentPage} />;

      case 'auth-page':
        return <AuthPage setUser={setUser} setCurrentPage={setCurrentPage} />;

      case 'healthcare-page':
        return (
          <ProtectedRoute user={user} setCurrentPage={setCurrentPage}>
            <HealthcarePage />
          </ProtectedRoute>
        );

      case 'education-page':
        return (
          <ProtectedRoute user={user} setCurrentPage={setCurrentPage}>
            <EducationPage />
          </ProtectedRoute>
        );

      case 'image-editing-page':
        return (
          <ProtectedRoute user={user} setCurrentPage={setCurrentPage}>
            <ImageEditingPage />
          </ProtectedRoute>
        );

      case 'about-page':
        return (
          <ProtectedRoute user={user} setCurrentPage={setCurrentPage}>
            <AboutPage />
          </ProtectedRoute>
        );

      case 'community-page':
        return (
          <ProtectedRoute user={user} setCurrentPage={setCurrentPage}>
            <CommunityPage />
          </ProtectedRoute>
        );

      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const getFooterDotIndex = () => {
    switch (currentPage) {
      case 'home-page': return 0;
      case 'healthcare-page': return 1;
      case 'education-page': return 2;
      case 'image-editing-page': return 3;
      case 'about-page': return 4;
      case 'community-page': return 5;
      case 'auth-page': return 6;
      default: return 0;
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Header
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          user={user}
          setUser={setUser}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={renderPage()} />
            <Route
              path="/login-success"
              element={
                <LoginSuccess
                  setUser={setUser}
                  setCurrentPage={setCurrentPage}
                />
              }
            />
          </Routes>
        </main>
        <Footer activeDot={getFooterDotIndex()} />
      </div>
    </Router>
  );
}

export default App;
