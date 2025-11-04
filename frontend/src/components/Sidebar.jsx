import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EcoMeter from './EcoMeter'

export default function Sidebar({ collapsed = false }) {
  const { user } = useAuth()
  const name = user?.name || 'Guest'
  const points = user?.ecoPoints || 0

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div className="profile-avatar">{name[0]}</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{points} eco-points</div>
          </div>
        )}
      </div>

      <nav className="nav">
        <NavLink to="/" end className="nav-link">{collapsed ? '🏠' : 'Home'}</NavLink>
        <NavLink to="/discover" className="nav-link">{collapsed ? '🧭' : 'Discover Trips'}</NavLink>
        <NavLink to="/itineraries" className="nav-link">{collapsed ? '🧳' : 'My Itineraries'}</NavLink>
        <NavLink to="/safety" className="nav-link">{collapsed ? '🛡️' : 'Real-Time Context & Safety'}</NavLink>
        <NavLink to="/eco" className="nav-link">{collapsed ? '🌿' : 'Eco Score'}</NavLink>
        <NavLink to="/local" className="nav-link">{collapsed ? '🗺️' : 'Local Culture'}</NavLink>
        <NavLink to="/rewards" className="nav-link">{collapsed ? '🏆' : 'Rewards'}</NavLink>
        <NavLink to="/settings" className="nav-link">{collapsed ? '⚙️' : 'Settings'}</NavLink>
      </nav>

      <div className="sidebar-bottom">
        <EcoMeter />
      </div>
    </aside>
  )
}
