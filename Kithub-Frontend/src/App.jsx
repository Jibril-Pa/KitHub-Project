import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
import Register from './Register';
import Settings from './Settings';
import PrivateRoute from './PrivateRoute';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Restore session from localStorage
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    if (storedLogin && storedUser && storedUser.id) {
      setIsLoggedIn(true);
      setUser(storedUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
    
  }, []);

if(loading) return null;
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Home user={user} setIsLoggedIn={setIsLoggedIn} />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Settings user={user} setIsLoggedIn={setIsLoggedIn} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
