import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage({ setIsLoggedIn,isLoggedIn }) {

  useEffect(() => {
    document.title = "KitHub  | Login";
  }, []);


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = e => setUserName(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);
    /* these user exists only for demo*/
    const dummyUsers = [
        { username: 'whiskers', password: 'meow123' },
        { username: 'mittens', password: 'purrfect' },
        { username: 'shadow', password: 'sleepycat' }
      ];


      useEffect(() => {
        if (isLoggedIn) {
          navigate('/home');
        }
      }, [isLoggedIn, navigate]);

      const handleSubmit = e => {
        e.preventDefault();
      
        const validUser = dummyUsers.find(
          (user) => user.username === userName && user.password === password
        );
      
        if (validUser) {
          localStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);
          navigate('/home');
        } else {
          alert("Invalid username or password!");
        }
      
        setUserName('');
        setPassword('');
      };

    /*const handleSubmit = e => { un comment this when done w demo phase
        e.preventDefault();
        if (userName && password) {
            localStorage.setItem("isLoggedIn", "true");
            setIsLoggedIn(true);
      
            navigate('/home');
        }
        setUserName('');
        setPassword('');
    };*/

    return (
        <div className="login-form">
            <h2 className="login-header">Welcome to KitHub</h2>
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
