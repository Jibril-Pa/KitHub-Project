import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './Navbar.css';
import Home from '../Home';
import LoginPage from "../LoginPage";
import Settings from "../Settings";
function Navbar({ setIsLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goToSettings = () => {
    navigate("/Settings");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    console.log("Logged out");
    window.location.href = "/";
    setMenuOpen(false);
  };

  return (
        <nav className="navbar">
      <div className="navbar-left">
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
          <div className="dropdown-item" onClick={goToSettings}>Settings</div>
          <div className="dropdown-item" onClick={handleLogout}>Logout</div>
        </div>
      </div>

      <div className="navbar-center">
      <Link to="/" className="navbar-title">
        KitHub
      </Link>
      </div>

      <div className="navbar-right">
      <div className="hamburger ghost">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
    </div>
  </div>
    </nav>
  );
}

export default Navbar;