import React from 'react'

export default function OverviewCard({ title, value, icon, trend, trendUp, children }) {
  return (
    <div className="overview-card modern-card" style={{ transformStyle: 'preserve-3d' }}>
      <div className="card-icon-badge">{icon}</div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
        {trend && (
          <div className={`card-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            <span className="trend-icon">{trendUp ? '↗' : '↘'}</span>
            <span className="trend-text">{trend} from last month</span>
          </div>
        )}
        <div className="card-extra">{children}</div>
      </div>
    </div>
  )
}
