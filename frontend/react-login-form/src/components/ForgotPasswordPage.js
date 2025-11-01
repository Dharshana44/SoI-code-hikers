import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Login.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Adjust path as needed

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset link sent to ${email}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className="login-main">
        <div className="login-left">
          <p className="travel-highlight">RESET PASSWORD</p>
          <h1>Forgot your password?</h1>
          <p className="subtitle">
            Enter your email address below and we'll send you a reset link.
          </p>
        </div>
        <div className="login-right glass-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <p style={{color:'red'}}>{error}</p>}
            {message && <p style={{color:'green'}}>{message}</p>}
            <button className="login-btn" type="submit">
              Send Reset Link
            </button>
            <div className="signup-row">
              Remembered your password? <Link to="/">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
