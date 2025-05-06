import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage({ setIsLoggedIn, isLoggedIn }) {
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
      const response = await fetch('http://localhost:7777/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, user_password: password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store login status and user ID
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.userId); // Store userId for later use
        setIsLoggedIn(true);
        const user = {
          username: data.username,
        };
      
        localStorage.setItem('user', JSON.stringify(user)); // Save for refreshes
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
