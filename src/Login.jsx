// src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [serverMessage, setServerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Formik setup with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setServerMessage('');

      try {
        const response = await axios.post('http://localhost:5000/login', values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setServerMessage(response.data.message);
        resetForm();
        // Redirect to dashboard or another page after successful login
        navigate('/dashboard');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setServerMessage(error.response.data.message);
        } else {
          setServerMessage('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        {/* Email Field */}
        <div style={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            style={styles.input}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={styles.error}>{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Password Field */}
        <div style={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            style={styles.input}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={styles.error}>{formik.errors.password}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Server Response Message */}
      {serverMessage && <div style={styles.serverMessage}>{serverMessage}</div>}

      {/* Link to Signup */}
      <p style={styles.linkText}>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
    </div>
  );
};

// Basic inline styles for demonstration purposes
const styles = {
  container: {
    width: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  error: {
    color: 'red',
    marginTop: '5px',
    fontSize: '12px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  serverMessage: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
    textAlign: 'center',
    color: '#721c24',
  },
  linkText: {
    marginTop: '15px',
    textAlign: 'center',
  },
};

export default Login;
