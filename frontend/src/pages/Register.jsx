import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Login.css'
import { createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebase'

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    try {
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      if (credential && credential.user) {
        navigate('/')
      } else {
        setError('Signup did not return a user')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result && result.user) {
        navigate('/')
      } else {
        setError('Google signup did not return a user')
      }
    } catch (err) {
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
      setError(err.message)
    }
  }

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className="login-main">
        <div className="login-left">
          <p className="travel-highlight">JOIN US</p>
          <h1>Create Your Account</h1>
          <p className="subtitle">Become a part of our travel community and explore the world with us.</p>
        </div>
        <div className="login-right glass-card">
          <form onSubmit={handleEmailSignup}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button className="login-btn" type="submit">Sign Up</button>
          </form>

          <div className="or-divider">Or</div>

          <div className="social-btn-row">
            <button type="button" className="social-btn google" onClick={handleGoogleSignup}><img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />Google</button>
          </div>

          <div className="signup-row">Already have an account? <Link to="/login">Login</Link></div>
        </div>
      </div>
    </div>
  )
}
