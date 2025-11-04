import React, { useEffect, useState, useRef } from 'react'
import OverviewCard from '../components/OverviewCard'
import MapPanel from '../components/MapPanel'
import ThreeBackground from '../components/ThreeBackground'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const travelData = [
  { month: 'Jan', trips: 45 },
  { month: 'Feb', trips: 52 },
  { month: 'Mar', trips: 68 },
  { month: 'Apr', trips: 81 },
  { month: 'May', trips: 95 },
  { month: 'Jun', trips: 102 },
]

const destinationTypes = [
  { name: 'Nature & Wildlife', value: 35, color: '#10b981' },
  { name: 'Cultural Heritage', value: 28, color: '#06b6d4' },
  { name: 'Adventure', value: 22, color: '#8b5cf6' },
  { name: 'Wellness & Spa', value: 15, color: '#f59e0b' },
]

const featuredDestinations = [
  {
    name: 'Maldives Islands',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    rating: 4.9,
    type: 'Beach Paradise',
    eco: 92
  },
  {
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    rating: 4.8,
    type: 'Mountain Adventure',
    eco: 95
  },
  {
    name: 'Kyoto Gardens',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    rating: 4.9,
    type: 'Cultural Heritage',
    eco: 88
  }
]

export default function Overview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const parallaxRef = useRef(null)

  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/overview'
    fetch(url)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => {
        setData({ 
          totalTrips: '127', 
          plannedTrips: 8, 
          ecoScore: '85%', 
          carbonSaved: '2.4t',
          monthlyTrips: travelData 
        })
      })
      .finally(() => setLoading(false))
  }, [])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const monthData = data?.monthlyTrips || travelData
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      {/* 3D Animated Background */}
      <ThreeBackground />
      
      <div className="dashboard-page dashboard-3d">
        {/* Hero Header */}
        <div className="dashboard-header fade-in">
        <div>
          <h1 className="dashboard-title">
            <span className="wave-emoji">�</span> Smart Tourism Dashboard
          </h1>
          <p className="dashboard-subtitle">Your personalized eco-friendly travel companion • {currentDate}</p>
        </div>
        <button className="cta-button">
          <span className="btn-icon">�️</span> Plan New Trip
        </button>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid fade-in">
        <OverviewCard 
          title="Total Journeys" 
          value={loading ? '…' : data?.totalTrips}
          icon="✈️"
          trend="+12%"
          trendUp={true}
        />
        <OverviewCard 
          title="Upcoming Trips" 
          value={loading ? '…' : data?.plannedTrips}
          icon="�"
          trend="Next: Dec 15"
          trendUp={false}
        />
        <OverviewCard 
          title="Eco Score" 
          value={loading ? '…' : data?.ecoScore}
          icon="🌱"
          trend="+8%"
          trendUp={true}
        />
        <OverviewCard 
          title="Carbon Offset" 
          value={loading ? '…' : data?.carbonSaved}
          icon="♻️"
          trend="+2.1t"
          trendUp={true}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid fade-in">
        {/* Left Section - Travel Insights */}
        <div className="dashboard-left">
          
          {/* Travel Map */}
          <div className="map-section glass-effect">
            <div className="section-header">
              <div>
                <h3 className="section-title">🗺️ Your Travel Map</h3>
                <p className="section-subtitle">Explore eco-friendly destinations worldwide</p>
              </div>
              <button className="icon-btn">🔍</button>
            </div>
            <MapPanel />
          </div>

          {/* Travel Activity Chart */}
          <div className="chart-card glass-effect">
            <div className="section-header">
              <div>
                <h3 className="section-title">📈 Travel Activity</h3>
                <p className="section-subtitle">Your journey timeline this year</p>
              </div>
              <div className="chart-filters">
                <button className="filter-btn active">6M</button>
                <button className="filter-btn">1Y</button>
                <button className="filter-btn">All</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="travelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#travelGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Destination Preferences */}
          <div className="chart-card glass-effect">
            <div className="section-header">
              <div>
                <h3 className="section-title">🎯 Travel Preferences</h3>
                <p className="section-subtitle">Your favorite destination types</p>
              </div>
            </div>
            <div className="preferences-grid">
              {destinationTypes.map((type, index) => (
                <div key={index} className="preference-card">
                  <div className="preference-bar">
                    <div 
                      className="preference-fill" 
                      style={{ 
                        width: `${type.value}%`, 
                        backgroundColor: type.color 
                      }}
                    />
                  </div>
                  <div className="preference-info">
                    <span className="preference-name">{type.name}</span>
                    <span className="preference-value" style={{ color: type.color }}>
                      {type.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Smart Recommendations */}
        <div className="dashboard-right">
          
          {/* AI Travel Suggestions */}
          <div className="widget-card glass-effect ai-suggestions">
            <div className="widget-header">
              <h4 className="widget-title">🤖 Smart Recommendations</h4>
              <span className="ai-badge">AI Powered</span>
            </div>
            <div className="suggestions-list">
              <div className="suggestion-item featured">
                <div className="suggestion-image">🏞️</div>
                <div className="suggestion-content">
                  <div className="suggestion-title">Swiss Alps Eco-Trek</div>
                  <div className="suggestion-subtitle">7 days • Carbon Neutral</div>
                  <div className="suggestion-tags">
                    <span className="tag">🌿 Eco-Certified</span>
                    <span className="tag">⭐ 4.9</span>
                  </div>
                </div>
              </div>

              <div className="suggestion-item">
                <div className="suggestion-image">🏖️</div>
                <div className="suggestion-content">
                  <div className="suggestion-title">Bali Wellness Retreat</div>
                  <div className="suggestion-subtitle">5 days • Sustainable Stay</div>
                  <div className="suggestion-tags">
                    <span className="tag">🧘 Wellness</span>
                    <span className="tag">⭐ 4.7</span>
                  </div>
                </div>
              </div>

              <div className="suggestion-item">
                <div className="suggestion-image">🏛️</div>
                <div className="suggestion-content">
                  <div className="suggestion-title">Kyoto Cultural Journey</div>
                  <div className="suggestion-subtitle">4 days • Heritage Sites</div>
                  <div className="suggestion-tags">
                    <span className="tag">🎎 Cultural</span>
                    <span className="tag">⭐ 4.8</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="explore-btn">
              Explore All Destinations →
            </button>
          </div>

          {/* Eco Impact */}
          <div className="widget-card glass-effect eco-widget">
            <div className="widget-header">
              <h4 className="widget-title">🌍 Your Eco Impact</h4>
            </div>
            <div className="eco-score-circle">
              <svg width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#e5f8f3"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#ecoGradient)"
                  strokeWidth="12"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * 85) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
                <defs>
                  <linearGradient id="ecoGradient">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="eco-score-text">
                <div className="eco-number">85</div>
                <div className="eco-label">Eco Score</div>
              </div>
            </div>
            <div className="eco-achievements">
              <div className="achievement-item">
                <span className="achievement-icon">�</span>
                <div>
                  <div className="achievement-value">248</div>
                  <div className="achievement-label">Trees Equivalent</div>
                </div>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">♻️</span>
                <div>
                  <div className="achievement-value">2.4t</div>
                  <div className="achievement-label">CO₂ Offset</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="widget-card glass-effect quick-actions-widget">
            <h4 className="widget-title">⚡ Quick Actions</h4>
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <span className="action-icon">🎫</span>
                <span className="action-text">Book Trip</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📍</span>
                <span className="action-text">Explore</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">💚</span>
                <span className="action-text">Favorites</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📊</span>
                <span className="action-text">Reports</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3D Featured Destinations Showcase */}
      <div className="featured-destinations-section fade-in" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        <div className="section-header-center">
          <h2 className="featured-title">✨ Featured Destinations</h2>
          <p className="featured-subtitle">Handpicked eco-friendly travel experiences</p>
        </div>
        
        <div className="destinations-3d-grid">
          {featuredDestinations.map((dest, index) => (
            <div 
              key={index} 
              className="destination-3d-card"
              style={{
                animationDelay: `${index * 0.2}s`,
                transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 10}px)`
              }}
            >
              <div className="destination-3d-inner">
                <div className="destination-image-container">
                  <img src={dest.image} alt={dest.name} className="destination-image" />
                  <div className="destination-overlay">
                    <div className="destination-badge eco-badge">
                      🌿 Eco {dest.eco}%
                    </div>
                    <div className="destination-badge rating-badge">
                      ⭐ {dest.rating}
                    </div>
                  </div>
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{dest.name}</h3>
                  <p className="destination-type">{dest.type}</p>
                  <button className="destination-cta">
                    <span>Explore</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>
    </>
  )
}
