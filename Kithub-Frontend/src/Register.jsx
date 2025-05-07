import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KitHub | Register";
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!userName || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const userData = {
            user_name: userName,
            user_password: password,
        };

        fetch("http://192.168.7.82:7777/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    navigate('/home', { replace: true });
                } else {
                    setError(data.message || 'Registration failed.');
                }
            })
            .catch(error => {
                setError("Error connecting to the server");
                console.error("Error:", error);
            });

        setUserName('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="login-form">
            <h2>Create New Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="cred-box">
                    <input
                        type="text"
                        placeholder="Enter Username…"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Enter Password…"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password…"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    {error && <p className="error">{error}</p>}
                </div>

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}
