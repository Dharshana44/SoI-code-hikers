import React, { useState } from 'react';
import '../Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase/firebase'; // Make sure this path is correct!

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Google login
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // successful sign-in
    setError('');
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    setError(err.message || 'Google sign-in failed');
  }
};

// Apple login
const handleAppleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    // successful sign-in
    setError('');
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    setError(err.message || 'Apple sign-in failed');
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // or your main user page
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className="login-main">
        <div className="login-left">
          <p className="travel-highlight">I TRAVEL</p>
          <h1>
            BEYOND <br />
            BORDERS
          </h1>
          <p className="subtitle">
            Unlock the world. Let your wanderlust lead you to your dream destinations.
          </p>
        </div>
        <div className="login-right glass-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="forgot-signup-row">
              <Link to="/forgot" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {error && <p style={{color:'red'}}>{error}</p>}

            <button className="login-btn" type="submit">
              Sign in
            </button>

            <div className="or-divider">Or</div>

            <div className="social-btn-row">
              <button type="button" className="social-btn google" onClick={handleGoogleLogin}>
  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
  Google
</button>
<button type="button" className="social-btn apple" onClick={handleAppleLogin}>
  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
  Apple
</button>

            </div>

            <div className="signup-row">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
