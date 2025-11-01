import React from 'react'
import MapPanel from '../components/MapPanel'

export default function Hub() {
  return (
    <div className="page hub">
      <h2>Local Community Hub</h2>
      <div className="hub-grid">
        <MapPanel placeholder="Local vendors map" />
        <div className="vendor-list">
          <h3>Verified Vendors</h3>
          <ul>
            <li>Homestay A</li>
            <li>Guide B</li>
            <li>Cafe C</li>
          </ul>
          <h4>Support Local Leaderboard</h4>
          <ol>
            <li>Village X</li>
            <li>Village Y</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
