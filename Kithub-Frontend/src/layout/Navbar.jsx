import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import Home from '../Home';
import LoginPage from "../LoginPage";
import Settings from "../Settings";
function Navbar() {
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
    console.log("Logged out");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav class="navbar">
  <div class="navbar-left">
    <div class="hamburger" onClick={toggleMenu}>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    
    <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
          <div className="dropdown-item" onClick={goToSettings}>Settings</div>
          <div className="dropdown-item" onClick={handleLogout}>Logout</div>
        </div>

  </div>

  <div class="navbar-center">
    <h1 class="navbar-title">KitHub</h1>
  </div>

  <div class="navbar-right">
  </div>
</nav>
  );
}

export default Navbar;