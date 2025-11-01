import React from 'react'

export default function OverviewCard({ title, value, children }) {
  return (
    <div className="overview-card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <div className="card-extra">{children}</div>
    </div>
  )
}
