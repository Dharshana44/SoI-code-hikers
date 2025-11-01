import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css'; // Your existing styles
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, GoogleAuthProvider, OAuthProvider } from "../firebase/firebase"; // your firebase.js path


const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // You could store the full name separately if needed
      navigate('/'); // After signup redirect, adjust path if needed
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleSignup = async () => {
    setError('');
    try {
      await signInWithPopup(auth, appleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className="login-main">
        <div className="login-left">
          <p className="travel-highlight">JOIN US</p>
          <h1>Create Your Account</h1>
          <p className="subtitle">
            Become a part of our travel community and explore the world with us.
          </p>
        </div>
        <div className="login-right glass-card">
          <form onSubmit={handleEmailSignup}>
            

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button className="login-btn" type="submit">
              Sign Up
            </button>
          </form>

          <div className="or-divider">Or</div>

          <div className="social-btn-row">
            <button type="button" className="social-btn google" onClick={handleGoogleSignup}>
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
              Google
            </button>
            <button type="button" className="social-btn apple" onClick={handleAppleSignup}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
              Apple
            </button>
          </div>

          <div className="signup-row">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
