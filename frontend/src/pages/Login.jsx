import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Login.css'
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider, appleProvider } from '../firebase/firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result && result.user) {
        setError('')
        navigate('/')
      } else {
        setError('Google sign-in did not return a user')
      }
    } catch (err) {
      // if popup is blocked or user closed it, fallback to redirect flow
      if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked')) {
        try {
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (redirectErr) {
          console.error('redirect fallback failed', redirectErr)
          setError(redirectErr.message || 'Google redirect failed')
          return
        }
      }
      console.error(err)
      setError(err.message || 'Google sign-in failed')
    }
  }

  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider)
      if (result && result.user) {
        setError('')
        navigate('/')
      } else {
        setError('Apple sign-in did not return a user')
      }
    } catch (err) {
      if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked')) {
        try {
          await signInWithRedirect(auth, appleProvider)
          return
        } catch (redirectErr) {
          console.error('redirect fallback failed', redirectErr)
          setError(redirectErr.message || 'Apple redirect failed')
          return
        }
      }
      console.error(err)
      setError(err.message || 'Apple sign-in failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      if (credential && credential.user) {
        navigate('/')
      } else {
        setError('Email sign-in did not return a user')
      }
    } catch (err) {
      setError('Invalid email or password')
    }
  }

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
          <p className="subtitle">Unlock the world. Let your wanderlust lead you to your dream destinations.</p>
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

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
              Don’t have an account? <Link to="/register">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
