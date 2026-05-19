const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool (better performance)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // Change to 'victory_admin' if created
  password: '',  // Your MySQL password
  database: 'victory_club',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database!');
    connection.release();
  }
});

// Create Tables
const createTables = () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      age INT,
      sport VARCHAR(50),
      membership_type ENUM('Basic', 'Premium', 'VIP') DEFAULT 'Basic',
      join_date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      subject VARCHAR(200),
      message TEXT,
      status ENUM('New', 'Read', 'Replied') DEFAULT 'New',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS teams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      team_name VARCHAR(100) NOT NULL,
      sport_type VARCHAR(50),
      coach_name VARCHAR(100),
      total_members INT DEFAULT 0,
      achievements TEXT,
      founded_year YEAR,
      image_url VARCHAR(500)
    )`,
    
    `CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_title VARCHAR(200),
      image_url VARCHAR(500) NOT NULL,
      category VARCHAR(50),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS schedule (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_name VARCHAR(200) NOT NULL,
      event_date DATE NOT NULL,
      event_time TIME,
      venue VARCHAR(200),
      team_involved VARCHAR(200),
      description TEXT
    )`
  ];

  queries.forEach((query, index) => {
    pool.query(query, (err) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err.message);
      }
    });
  });
  console.log('✅ All tables created/checked');
};

createTables();

// ==================== API ROUTES ====================

// 1. CONTACT FORM
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  const sql = `INSERT INTO contacts (name, email, phone, subject, message) 
               VALUES (?, ?, ?, ?, ?)`;
  
  pool.query(sql, [name, email, phone, subject, message], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      message: 'Message saved to database!',
      id: result.insertId 
    });
  });
});

// 2. MEMBERSHIP REGISTRATION
app.post('/api/membership', (req, res) => {
  const { full_name, email, phone, age, sport, membership_type } = req.body;
  
  const sql = `INSERT INTO members (full_name, email, phone, age, sport, membership_type) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  pool.query(sql, [full_name, email, phone, age, sport, membership_type], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.code === 'ER_DUP_ENTRY' ? 'Email already registered!' : err.message 
      });
    }
    res.json({ 
      success: true, 
      message: 'Membership application submitted!',
      member_id: result.insertId 
    });
  });
});

// 3. GET ALL TEAMS
app.get('/api/teams', (req, res) => {
  const sql = 'SELECT * FROM teams ORDER BY founded_year DESC';
  
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 4. ADD NEW TEAM (for admin)
app.post('/api/teams', (req, res) => {
  const { team_name, sport_type, coach_name, achievements, founded_year } = req.body;
  
  const sql = `INSERT INTO teams (team_name, sport_type, coach_name, achievements, founded_year) 
               VALUES (?, ?, ?, ?, ?)`;
  
  pool.query(sql, [team_name, sport_type, coach_name, achievements, founded_year], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, team_id: result.insertId });
  });
});

// 5. GET ALL MEMBERS
app.get('/api/members', (req, res) => {
  const sql = 'SELECT * FROM members ORDER BY join_date DESC';
  
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 6. GET SCHEDULE
app.get('/api/schedule', (req, res) => {
  const sql = 'SELECT * FROM schedule ORDER BY event_date ASC';
  
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 7. ADD SCHEDULE
app.post('/api/schedule', (req, res) => {
  const { event_name, event_date, event_time, venue, team_involved, description } = req.body;
  
  const sql = `INSERT INTO schedule (event_name, event_date, event_time, venue, team_involved, description) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  pool.query(sql, [event_name, event_date, event_time, venue, team_involved, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// 8. GET GALLERY IMAGES
app.get('/api/gallery', (req, res) => {
  const sql = 'SELECT * FROM gallery ORDER BY uploaded_at DESC';
  
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`MySQL Database: victory_club`);
});