import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav class="navbar">
  <div class="navbar-left">
    <div class="hamburger">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>

  <div class="navbar-center">
    <h1 class="navbar-title">KitHub</h1>
  </div>

  <div class="navbar-right"></div>
</nav>
  );
}

export default Navbar;