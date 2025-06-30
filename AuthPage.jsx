import React, { useState } from 'react';

const AuthPage = ({ setUser, setCurrentPage }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [message, setMessage] = useState('');

  const API_BASE = 'http://localhost:5000/auth';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async () => {
    setMessage('');
    const url = `${API_BASE}/${mode}`;
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    if (mode === 'register') {
      payload.name = formData.name;
      payload.role = formData.role;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('medhavi-token', data.token);
        localStorage.setItem('medhavi-user', JSON.stringify(data.user));
        setUser(data.user);
        alert(`🎉 Welcome, ${data.user.name}`);
        setCurrentPage('home-page');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
          {mode === 'login' ? '🔐 Login' : '📝 Register'}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-medium rounded-l ${mode === 'login' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('login')} >
            Login
          </button>
          <button
            className={`px-4 py-2 font-medium rounded-r ${mode === 'register' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('register')}>
            Register
          </button>
        </div>
        {mode === 'register' && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">👤 Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Your name"
            />
          </div>
        )}
        <div className="mb-3">
          <label className="block mb-1 font-medium">📧 Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="w-full border p-2 rounded"
            placeholder="example@email.com"
          />
        </div>

      <div className="mb-3">
          <label className="block mb-1 font-medium">🔑 Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            className="w-full border p-2 rounded"
            placeholder="********"
          />
        </div>

        {mode === 'register' && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">🧑‍💼 Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="general">General User</option>
            </select>
          </div>
        )}

        {message && <p className="text-red-500 mb-3">{message}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          {mode === 'login' ? '🔓 Login' : '✅ Register'}
        </button>

        {/* Google Auth */}
        <hr className="my-6" />
        <div className="text-center">
          <p className="text-gray-600 mb-2">Or continue with</p>
          <a
            href="http://localhost:5000/auth/google"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            🔐 Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
