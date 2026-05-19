import React, { useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // This will save to MySQL database
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      if (response.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Reset message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with Victory Club</p>
      </div>

      <div className="card">
        {submitted && (
          <div className="success-message">
            <p>Thank you! Your message has been saved to database.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn">Send Message</button>
        </form>
      </div>

      <div className="card">
        <h2>Club Location</h2>
        <p>Sports Complex, Main Boulevard, Karachi</p>
        
        <h2>Contact Info</h2>
        <p>Phone: 021-1234567</p>
        <p>Email: info@victoryclub.com</p>
        
        <h2>Office Hours</h2>
        <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
      </div>
    </div>
  );
}

export default Contact;