import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>🏆 Victory Club</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/schedule">Schedule</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/membership" className="membership-btn">Membership</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;