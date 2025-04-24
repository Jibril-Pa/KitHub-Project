import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ← import useNavigate
import './Register.css';

export default function Register() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();         // ← get the navigation fn

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // simple field checks
        if (!firstName || !lastName || !userName) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Create user object to send in the request
        const userData = {
            firstName,
            lastName,
            username: userName,
            password
        };

        // Call the Flask API to register the user
        fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // On success, navigate to the home page or wherever needed
                    navigate('/home', { replace: true });
                } else {
                    setError(data.message);  // Set error if registration fails
                }
            })
            .catch(error => {
                setError("Error connecting to the server");
                console.error("Error:", error);
            });

        // clear form (optional)
        setFirstName('');
        setLastName('');
        setUserName('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="login-form">
            <h2>Create New Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="cred-box">
                    <div>
                        <input
                            type="text"
                            id="FirstName"
                            placeholder="Enter First Name…"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            id="LastName"
                            placeholder="Enter Last Name…"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </div>
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
