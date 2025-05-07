import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const serverURL = `${window.location.protocol}//${window.location.hostname}:7777`;

export default function LoginPage({ setIsLoggedIn, setUser, isLoggedIn }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "KitHub | Login";
    if (isLoggedIn) navigate('/home');
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${serverURL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, user_password: password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        const user = {
          id: data.userId,
          username: data.username,
        };

        // ✅ Save to localStorage so other components can access it
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);         // needed by Home.js
        localStorage.setItem('username', user.username); // optional but helpful

        // ✅ Update app state
        setIsLoggedIn(true);
        setUser(user);
        navigate('/home');
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Could not connect to server.');
    }

    setUserName('');
    setPassword('');
  };

  return (
    <div className="login-form">
      <h2 className="login-header">Welcome to KitHub</h2>
      <form onSubmit={handleSubmit}>
        <div className="cred-box">
          <input
            type="text"
            placeholder="Enter Username…"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>

      <p className="register-prompt">
        No account?&nbsp;
        <Link to="/register" className="register-link">
          Create Account Here
        </Link>
      </p>
    </div>
  );
}
