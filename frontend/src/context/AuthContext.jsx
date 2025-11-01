import React, { createContext, useState, useEffect, useContext } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // minimal user object stored for app usage
        const userObj = { uid: u.uid, email: u.email, displayName: u.displayName }
        setUser(userObj)
        try {
          const token = await u.getIdToken()
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(userObj))
        } catch (e) {
          // ignore token storage errors
        }
      } else {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (e) {
      // ignore signout errors
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
