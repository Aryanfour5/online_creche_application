// src/components/Dashboard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h2>Welcome to Your Dashboard!</h2>
      <p>You have successfully logged in.</p>
      {/* Add more dashboard content here */}
      <Link to="/login" style={styles.logoutLink}>Logout</Link>
    </div>
  );
};

const styles = {
  container: {
    width: '600px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  logoutLink: {
    marginTop: '20px',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default Dashboard;
