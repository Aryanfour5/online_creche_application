// src/components/Signup.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Signup = () => {
  const [serverMessage, setServerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formik setup with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      aadharCard: '',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      aadharCard: Yup.string()
        .matches(/^\d{12}$/, 'Aadhar Card must be exactly 12 digits')
        .required('Aadhar Card is required'),
      phoneNumber: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Phone Number must be a 10-digit number starting with 6-9')
        .required('Phone Number is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setServerMessage('');

      try {
        const response = await axios.post('http://localhost:5000/signup', values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setServerMessage(response.data.message);
        resetForm();
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
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        {/* Username Field */}
        <div style={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            style={styles.input}
          />
          {formik.touched.username && formik.errors.username ? (
            <div style={styles.error}>{formik.errors.username}</div>
          ) : null}
        </div>

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

        {/* Aadhar Card Field */}
        <div style={styles.formGroup}>
          <label htmlFor="aadharCard">Aadhar Card</label>
          <input
            id="aadharCard"
            name="aadharCard"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.aadharCard}
            maxLength="12"
            style={styles.input}
          />
          {formik.touched.aadharCard && formik.errors.aadharCard ? (
            <div style={styles.error}>{formik.errors.aadharCard}</div>
          ) : null}
        </div>

        {/* Phone Number Field */}
        <div style={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            maxLength="10"
            style={styles.input}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div style={styles.error}>{formik.errors.phoneNumber}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>
      </form>

      {/* Server Response Message */}
      {serverMessage && <div style={styles.serverMessage}>{serverMessage}</div>}
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
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  serverMessage: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    textAlign: 'center',
    color: '#333',
  },
};

export default Signup;
