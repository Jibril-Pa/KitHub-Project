import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Home from './Home';
import Register from './Register';
import Settings from './Settings';
import PrivateRoute from './PrivateRoute';
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);
  return (
    <Routes>
      <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Home setIsLoggedIn={setIsLoggedIn} />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Settings setIsLoggedIn={setIsLoggedIn}/>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}