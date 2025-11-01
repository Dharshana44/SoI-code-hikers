import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function TopNav({ onToggleSidebar, collapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const name = user?.name || 'Guest'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topnav">
      <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
        <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          ☰
        </button>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="title">
          Dashboard
        </motion.div>
        <motion.div className="greeting" style={{ marginLeft: 18 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Good Morning, {name}! ☀️
        </motion.div>
      </div>
      <div className="right" style={{ display: 'flex', gap: 10 }}>
        <button className="ghost">Toggle Theme</button>
        <button className="ghost" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  )
}
