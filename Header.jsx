import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Header = ({ setCurrentPage, currentPage }) => {
  const [user, setUser] = useState(null);

  // Load user from token
  useEffect(() => {
    const token = localStorage.getItem('medhavi-token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('medhavi-token');
      }
    }
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('medhavi-token');
    localStorage.removeItem('medhavi-user');
    setUser(null);
    setCurrentPage('home-page');
  };

  const navLinks = [
    { name: 'Home', page: 'home-page' },
    { name: 'Healthcare', page: 'healthcare-page' },
    { name: 'Education', page: 'education-page' },
    { name: 'Image Lab', page: 'image-editing-page' },
    { name: 'About', page: 'about-page' },
    { name: 'Connect', page: 'community-page' },
  ];

  return (
    <header className="bg-white p-4 shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div
          className="flex items-center text-2xl font-bold text-gray-700 cursor-pointer"
          onClick={() => setCurrentPage('home-page')}>
          <img
            src="src/assets/Logo.png"
            alt="Medhavi Logo"
            className="w-10 h-10 mr-3 rounded" />
          <span>MEDHAVI</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === link.page
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:border-orange-500 border-2 border-transparent'
              }`}
              onClick={() => setCurrentPage(link.page)}
            >
              {link.name}
            </button>
          ))}

          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-3 ml-4">
              <img
                src={user.picture || "https://ui-avatars.com/api/?name=User&background=random"}
                alt="User"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/32?text=👤')}
                className="w-8 h-8 rounded-full border border-gray-300"/>
              <span className="text-gray-700 font-semibold">{user.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" >
                Logout
              </button>
            </div> ) : (
            <button
              onClick={() => setCurrentPage('auth-page')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Login
            </button>
          )}
      </nav>
      </div>
    </header>
  );
};

export default Header;
