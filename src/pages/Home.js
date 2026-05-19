import React from 'react';
import '../styles/App.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Victory Sports Club</h1>
          <p>Where champions are made. Join our winning team!</p>
          <button className="btn">Join Now</button>
        </div>
      </section>

      <section className="features">
        <div className="card">
          <h2>🏆 Our Achievements</h2>
          <p>15+ Championships | 50+ Tournaments | 200+ Members</p>
        </div>
        
        <div className="card">
          <h2>⏰ Training Schedule</h2>
          <p>Monday-Friday: 6AM-9PM | Weekends: Special Sessions</p>
        </div>
        
        <div className="card">
          <h2>👥 Expert Coaches</h2>
          <p>Certified trainers with 10+ years experience</p>
        </div>
      </section>
    </div>
  );
}

export default Home;