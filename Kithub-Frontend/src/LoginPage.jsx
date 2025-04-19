import React, { useState } from 'react';
import './loginPage.css'
export default function LoginPage(){
    const [userName,setuserName] = useState('');
    const [password,setPassword] = useState('');

    function handleUsernameChange(event){
        setuserName(event.target.value);
    };

    function handlePasswordChange(event){
        setPassword(event.target.value);
    };

    function handleSubmit(event){
        event.preventDefault();
        console.log('Username:', userName);
        console.log('Password:', password);

    };
    
    return (
        <div className ="login-form">
            <h2>Welcome to KitHub</h2>
            <form onSubmit = {handleSubmit}>
                <div className="cred-box">
                <input
                    type="text"
                    id="username"
                    placeholder='Enter Username...'
                    onChange = {handleUsernameChange}
                    value={userName}
                    />
                
                <input
                    type="password"
                    id="password"
                    placeholder='Enter Password...'
                    onChange = {handlePasswordChange}
                    value={password}
                    /> 
                  </div>
                <button type="submit" onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
}
