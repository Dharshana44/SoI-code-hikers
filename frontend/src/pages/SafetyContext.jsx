import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

export default function SafetyContext() {
  const [loading, setLoading] = useState(true)
  const [contextData, setContextData] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, emergency, weather
  const [gpsLocation, setGpsLocation] = useState(null)
  const [watchId, setWatchId] = useState(null)
  const [sosActive, setSosActive] = useState(false)
  const [notifications, setNotifications] = useState([])
  const sosTimerRef = useRef(null)

  useEffect(() => {
    // Initialize GPS tracking
    if ('geolocation' in navigator) {
      requestGPSLocation()
    } else {
      fetchContextData() // Fallback to IP-based location
    }

    // Set up automatic refresh every 5 minutes
    const intervalId = setInterval(() => {
      if (gpsLocation) {
        fetchContextDataWithGPS(gpsLocation.latitude, gpsLocation.longitude)
      }
    }, 300000) // 5 minutes

    return () => {
      clearInterval(intervalId)
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
      if (sosTimerRef.current) {
        clearTimeout(sosTimerRef.current)
      }
    }
  }, [])

  // Request GPS location
  const requestGPSLocation = () => {
    setLoading(true)
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        setGpsLocation(location)
        fetchContextDataWithGPS(location.latitude, location.longitude)
        
        // Start watching position for live tracking
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            setGpsLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy
            })
          },
          (err) => console.error('GPS watch error:', err),
          options
        )
        setWatchId(id)
      },
      (err) => {
        console.error('GPS error:', err)
        addNotification('⚠️ GPS unavailable, using IP-based location', 'warning')
        fetchContextData() // Fallback to IP-based
      },
      options
    )
  }

  // Fetch context data with GPS coordinates
  const fetchContextDataWithGPS = async (lat, lon) => {
    try {
      setLoading(true)
      setError(null)
      
      const backendUrl = 'http://localhost:4000'
      const response = await axios.post(`${backendUrl}/api/location/gps-context`, {
        latitude: lat,
        longitude: lon
      })
      
      setContextData(response.data)
      
      // Check for weather alerts
      if (response.data.weather && response.data.weather.alerts) {
        response.data.weather.alerts.forEach(alert => {
          addNotification(`🌦️ Weather Alert: ${alert}`, 'danger')
        })
      }
      
      // Check safety level
      if (response.data.safety && response.data.safety.level === 'caution') {
        addNotification('⚠️ You are in a caution zone. Stay alert!', 'warning')
      }
    } catch (err) {
      console.error('Error fetching GPS context data:', err)
      setError('Failed to load safety and context information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fallback to IP-based location
  const fetchContextData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const backendUrl = 'http://localhost:4000'
      const response = await axios.get(`${backendUrl}/api/location/context`)
      
      setContextData(response.data)
    } catch (err) {
      console.error('Error fetching context data:', err)
      setError('Failed to load safety and context information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Add notification to the list
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    }
    setNotifications(prev => [notification, ...prev].slice(0, 5)) // Keep last 5
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 10000)
  }

  // SOS Emergency Handler
  const handleSOS = async () => {
    if (sosActive) {
      // Cancel SOS
      setSosActive(false)
      if (sosTimerRef.current) {
        clearTimeout(sosTimerRef.current)
      }
      addNotification('SOS cancelled', 'info')
      return
    }

    // Activate SOS
    setSosActive(true)
    addNotification('🚨 SOS ACTIVATED! Emergency services will be notified in 5 seconds...', 'danger')
    
    // Give 5 seconds to cancel
    sosTimerRef.current = setTimeout(async () => {
      try {
        const location = gpsLocation || {
          latitude: contextData?.location?.latitude,
          longitude: contextData?.location?.longitude
        }

        const backendUrl = 'http://localhost:4000'
        await axios.post(`${backendUrl}/api/location/sos`, {
          location,
          timestamp: new Date().toISOString(),
          userInfo: {
            city: contextData?.location?.city,
            country: contextData?.location?.country
          }
        })

        addNotification('✅ SOS sent! Emergency contacts notified with your location.', 'success')
        
        // Share location link
        const locationUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
        if (navigator.share) {
          navigator.share({
            title: 'Emergency Location',
            text: `I need help! My location: ${contextData?.location?.city}`,
            url: locationUrl
          })
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(`Emergency! My location: ${locationUrl}`)
          addNotification('📋 Location link copied to clipboard', 'info')
        }
      } catch (err) {
        console.error('SOS error:', err)
        addNotification('Failed to send SOS. Please call emergency services directly.', 'danger')
      } finally {
        setSosActive(false)
      }
    }, 5000)
  }

  // Request alternative safe routes
  const getSafeRoutes = async () => {
    if (!gpsLocation && !contextData?.location) {
      addNotification('Location data not available', 'warning')
      return
    }

    try {
      const location = gpsLocation || {
        latitude: contextData?.location?.latitude,
        longitude: contextData?.location?.longitude
      }

      const backendUrl = 'http://localhost:4000'
      const response = await axios.post(`${backendUrl}/api/location/safe-routes`, {
        latitude: location.latitude,
        longitude: location.longitude
      })

      if (response.data.routes && response.data.routes.length > 0) {
        addNotification(`✅ Found ${response.data.routes.length} safer alternative routes`, 'success')
      } else {
        addNotification('Current route is optimal', 'info')
      }
    } catch (err) {
      console.error('Safe routes error:', err)
      addNotification('Failed to fetch alternative routes', 'warning')
    }
  }

  const getSafetyColor = (level) => {
    switch(level) {
      case 'safe': return '#10b981'
      case 'moderate': return '#f59e0b'
      case 'caution': return '#ef4444'
      default: return '#64748b'
    }
  }

  const getSafetyIcon = (level) => {
    switch(level) {
      case 'safe': return '✅'
      case 'moderate': return '⚠️'
      case 'caution': return '🚨'
      default: return 'ℹ️'
    }
  }

  if (loading) {
    return (
      <div className="safety-context-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your safety context...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="safety-context-page">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchContextData}>
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  if (!contextData) return null

  const { location, weather, safety, emergencyServices } = contextData

  // Additional safety check
  if (!location || !weather || !safety) {
    return (
      <div className="safety-context-page">
        <div className="error-container">
          <h2>⚠️ Data Error</h2>
          <p>Unable to load complete safety information. Please try refreshing.</p>
          <button className="retry-btn" onClick={fetchContextData}>
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="safety-context-page">
      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="notifications-panel">
          {notifications.map(notif => (
            <div key={notif.id} className={`notification notification-${notif.type}`}>
              <span>{notif.message}</span>
              <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="safety-header">
        <div>
          <h1 className="page-title">
            🛡️ Real-Time Context & Safety
          </h1>
          <p className="page-subtitle">
            {gpsLocation ? (
              <span className="gps-status active">
                📡 Live GPS Tracking Active (±{gpsLocation.accuracy.toFixed(0)}m)
              </span>
            ) : (
              <span className="gps-status">📍 IP-based Location</span>
            )}
          </p>
        </div>
        <div className="header-actions">
          <button 
            className={`sos-btn ${sosActive ? 'sos-active' : ''}`}
            onClick={handleSOS}
          >
            {sosActive ? '⏹️ CANCEL SOS' : '🚨 SOS EMERGENCY'}
          </button>
          <button className="refresh-btn" onClick={() => {
            if (gpsLocation) {
              fetchContextDataWithGPS(gpsLocation.latitude, gpsLocation.longitude)
            } else {
              fetchContextData()
            }
          }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Location Overview */}
      <div className="location-overview glass-card">
        <div className="location-icon">📍</div>
        <div className="location-details">
          <h2>{location.city}, {location.country}</h2>
          <p className="location-meta">
            {location.region} • {location.timezone} {gpsLocation ? '• Live GPS' : '• IP: ' + location.ip}
          </p>
          <p className="coordinates">
            📐 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
          <div className="location-actions">
            <button className="action-btn" onClick={getSafeRoutes}>
              🗺️ Find Safer Routes
            </button>
            <a 
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
            >
              🌍 View on Maps
            </a>
          </div>
        </div>
      </div>

      {/* Safety Score */}
      <div className="safety-score glass-card" style={{ borderLeft: `4px solid ${getSafetyColor(safety.level)}` }}>
        <div className="safety-score-header">
          <div className="safety-icon">{getSafetyIcon(safety.level)}</div>
          <div>
            <h3>Safety Score</h3>
            <p className="safety-level" style={{ color: safety.color }}>
              {safety.level.toUpperCase()} ZONE
            </p>
          </div>
          <div className="safety-score-number" style={{ color: safety.color }}>
            {safety.score}/100
          </div>
        </div>

        <div className="safety-progress">
          <div 
            className="safety-progress-bar" 
            style={{ 
              width: `${safety.score}%`,
              backgroundColor: safety.color 
            }}
          />
        </div>

        {safety.alerts && safety.alerts.length > 0 && (
          <div className="safety-alerts">
            <h4>🔔 Alerts</h4>
            {safety.alerts.map((alert, idx) => (
              <div key={idx} className="alert-item">
                {alert}
              </div>
            ))}
          </div>
        )}

        {safety.recommendations && safety.recommendations.length > 0 && (
          <div className="safety-recommendations">
            <h4>💡 Recommendations</h4>
            {safety.recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-item">
                • {rec}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🌤️ Weather
        </button>
        <button 
          className={`tab-btn ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
        >
          🏥 Emergency Services
        </button>
        <button 
          className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety')}
        >
          🛡️ Tourist Safety
        </button>
      </div>

      {/* Weather Tab */}
      {activeTab === 'overview' && weather && (
        <div className="weather-section glass-card fade-in">
          <h3>🌤️ Current Weather</h3>
          <div className="weather-grid">
            <div className="weather-main">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="weather-icon"
              />
              <div className="weather-temp">
                <span className="temp-value">{Math.round(weather.temperature)}°C</span>
                <p className="weather-desc">{weather.description}</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="weather-detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{Math.round(weather.feelsLike)}°C</span>
              </div>
              <div className="weather-detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="weather-detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} m/s</span>
              </div>
              <div className="weather-detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Services Tab */}
      {activeTab === 'emergency' && (
        <div className="emergency-section fade-in">
          {/* Hospitals */}
          <div className="emergency-card glass-card">
            <h3>🏥 Nearby Hospitals</h3>
            {emergencyServices.hospitals && emergencyServices.hospitals.length > 0 ? (
              <div className="services-list">
                {emergencyServices.hospitals.map((hospital, idx) => (
                  <div key={idx} className="service-item">
                    <div className="service-icon">🏥</div>
                    <div className="service-details">
                      <h4>{hospital.name}</h4>
                      <p className="service-address">{hospital.address}</p>
                      <div className="service-meta">
                        {hospital.rating !== 'N/A' && (
                          <span className="rating">⭐ {hospital.rating}</span>
                        )}
                        <span className={`status ${hospital.isOpen ? 'open' : 'closed'}`}>
                          {hospital.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No hospitals found nearby</p>
            )}
          </div>

          {/* Police Stations */}
          <div className="emergency-card glass-card">
            <h3>👮 Nearby Police Stations</h3>
            {emergencyServices.policeStations && emergencyServices.policeStations.length > 0 ? (
              <div className="services-list">
                {emergencyServices.policeStations.map((station, idx) => (
                  <div key={idx} className="service-item">
                    <div className="service-icon">👮</div>
                    <div className="service-details">
                      <h4>{station.name}</h4>
                      <p className="service-address">{station.address}</p>
                      <div className="service-meta">
                        {station.rating !== 'N/A' && (
                          <span className="rating">⭐ {station.rating}</span>
                        )}
                        <span className={`status ${station.isOpen ? 'open' : 'closed'}`}>
                          {station.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No police stations found nearby</p>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="emergency-card glass-card">
            <h3>📞 Emergency Contacts</h3>
            <div className="emergency-contacts">
              <div className="contact-item">
                <span className="contact-icon">🚨</span>
                <span className="contact-label">Police</span>
                <span className="contact-number">{safety.emergencyNumbers?.police || '100'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🚑</span>
                <span className="contact-label">Ambulance</span>
                <span className="contact-number">{safety.emergencyNumbers?.ambulance || '108'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🚒</span>
                <span className="contact-label">Fire</span>
                <span className="contact-number">{safety.emergencyNumbers?.fire || '101'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">ℹ️</span>
                <span className="contact-label">Tourist Helpline</span>
                <span className="contact-number">{safety.emergencyNumbers?.touristHelpline || '1363'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tourist Safety Advisories Tab */}
      {activeTab === 'safety' && safety.touristAdvisories && (
        <div className="safety-advisories-section glass-card fade-in">
          <h3>🛡️ Tourist Safety Advisories</h3>
          <p className="section-subtitle">Real-world safety tips for travelers</p>
          
          <div className="advisories-grid">
            {safety.touristAdvisories.map((advisory, idx) => (
              <div key={idx} className={`advisory-card ${advisory.severity}`}>
                <div className="advisory-header">
                  <span className="advisory-icon">{advisory.icon}</span>
                  <h4>{advisory.type}</h4>
                  <span className={`severity-badge ${advisory.severity}`}>
                    {advisory.severity.toUpperCase()}
                  </span>
                </div>
                <p className="advisory-message">{advisory.message}</p>
              </div>
            ))}
          </div>

          {/* Additional Safety Tips */}
          <div className="safety-tips">
            <h4>📋 Essential Safety Checklist</h4>
            <div className="tips-grid">
              <div className="tip-item">
                <span>✅</span>
                <span>Keep photocopies of passport & documents</span>
              </div>
              <div className="tip-item">
                <span>✅</span>
                <span>Register with your embassy</span>
              </div>
              <div className="tip-item">
                <span>✅</span>
                <span>Share itinerary with family/friends</span>
              </div>
              <div className="tip-item">
                <span>✅</span>
                <span>Purchase travel insurance</span>
              </div>
              <div className="tip-item">
                <span>✅</span>
                <span>Learn basic local phrases</span>
              </div>
              <div className="tip-item">
                <span>✅</span>
                <span>Save emergency numbers offline</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
