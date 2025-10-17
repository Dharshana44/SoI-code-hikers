import React, { useEffect, useState } from 'react'
import OverviewCard from '../components/OverviewCard'
import MapPanel from '../components/MapPanel'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const sampleData = [
  { month: 'Jan', trips: 800 },
  { month: 'Feb', trips: 920 },
  { month: 'Mar', trips: 1100 },
  { month: 'Apr', trips: 980 },
  { month: 'May', trips: 1248 },
  { month: 'Jun', trips: 1320 },
]

export default function Overview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vite exposes env vars on import.meta.env. Set VITE_BACKEND_URL to override.
    const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/overview'
    fetch(url)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => {
        // fallback to sampleData
        setData({ totalTrips: '1,248', popularDestinations: 12, sustainabilityScore: '78%', ecoImpact: 42, monthlyTrips: sampleData })
      })
      .finally(() => setLoading(false))
  }, [])

  const monthData = data?.monthlyTrips || sampleData

  return (
    <div className="page overview">
      <h2>Overview</h2>
      <div className="cards">
        <OverviewCard title="Total Trips" value={loading ? '…' : data?.totalTrips} />
        <OverviewCard title="Popular Destinations" value={loading ? '…' : data?.popularDestinations} />
        <OverviewCard title="Sustainability Score" value={loading ? '…' : data?.sustainabilityScore} />
      </div>

      <section className="overview-section">
        <div style={{flex:1}}>
          <MapPanel />
          <div className="chart-card">
            <h3>Trips this year</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={monthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stroke="#10b981" fillOpacity={1} fill="url(#colorTrips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="widgets">
          <div className="widget weather">
            <h4>Live weather</h4>
            <div>Location: sample</div>
            <div>Temp: --</div>
            <div>Crowd: --</div>
          </div>

          <div className="widget ai-reco">
            <h4>AI Recommendations</h4>
            <ol>
              <li>2-night eco-stay at Green Farm</li>
              <li>Guided village walk (morning)</li>
              <li>Low-impact transport via shared shuttle</li>
            </ol>
            <div style={{marginTop:8}}>
              <button className="btn">Export as PDF</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
