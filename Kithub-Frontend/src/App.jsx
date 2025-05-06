import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
import Register from './Register';
import Settings from './Settings';
import PrivateRoute from './PrivateRoute';
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    setIsLoggedIn(storedLogin);
    if (storedLogin && storedUser) {
      setUser(storedUser); // ✅ restores the user on refresh
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUser={setUser}  isLoggedIn={isLoggedIn}/>} />
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
            <Settings user={user}  setIsLoggedIn={setIsLoggedIn}/>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}