import React, { useState } from 'react';
import { redirect } from 'react-router-dom';
import './Register.css'

export default function RegisterPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // optional: local error state if you want to show it in the UI instead of alert
    const [error, setError] = useState('');

    function handleUsernameChange(e) {
        setUserName(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
    }

    function handleFirstNameChange(e) {
        setFirstName(e.target.value);
    }

    function handleLastNameChange(e) {
        setLastName(e.target.value);
    }

    // simple validator function
    function passwordsMatch() {
        return password === confirmPassword;
    }

    function handleSubmit(e) {
        e.preventDefault();
        // clear any previous error
        setError('');

        if (!passwordsMatch()) {
            // you can also setError("Passwords do not match") and render it in the JSX
            alert('Passwords do not match');
            return;
        }

        // at this point passwords match, so go ahead and "create the account"
        console.log('Creating account for:', { firstName, lastName, userName });
        redirect('/home');

        // clear form
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
                    <div id="Name">
                        <input
                            type="text"
                            id="FirstName"
                            placeholder="Enter First"
                            value={firstName}
                            onChange={handleFirstNameChange}
                        />
                        <input
                            type="text"
                            id="LastName"
                            placeholder="Enter Last"
                            value={lastName}
                            onChange={handleLastNameChange}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter Username..."
                        value={userName}
                        onChange={handleUsernameChange}
                    />
                    <input
                        type="password"
                        placeholder="Enter Password..."
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password..."
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    {/* if you prefer inline error messages */}
                    {error && <p className="error">{error}</p>}
                </div>
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}
