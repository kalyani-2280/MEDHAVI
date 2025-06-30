import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const LoginSuccess = ({ setUser, setCurrentPage }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        localStorage.setItem('medhavi-token', token);
        localStorage.setItem('medhavi-user', JSON.stringify(decoded));
        setUser(decoded);
        alert(`🎉 Welcome, ${decoded.name || 'User'}`);
        setCurrentPage('home-page');
        navigate('/');
      } catch {
        alert(' Invalid token from Google login');
        navigate('/');
      }
    } else {
      alert(' Token missing from Google login');
      navigate('/');
    }
  }, [navigate, setUser, setCurrentPage]);

  return (
    <div className="min-h-screen flex justify-center items-center text-orange-600 text-lg font-bold">
      ⏳ Processing login...
    </div>
  );
};

export default LoginSuccess;
