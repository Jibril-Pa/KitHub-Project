import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = e => setUserName(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);

    const handleSubmit = e => {
        e.preventDefault();
        if (userName && password) {
            navigate('/home');
        }
        setUserName('');
        setPassword('');
    };

    return (
        <div className="login-form">
            <h2>Welcome to KitHub</h2>
            <form onSubmit={handleSubmit}>
                <div className="cred-box">
                    <input
                        type="text"
                        placeholder="Enter Username…"
                        value={userName}
                        onChange={handleUsernameChange}
                    />
                    <input
                        type="password"
                        placeholder="Enter Password…"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>

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
