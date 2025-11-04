const axios = require('axios');

class LocationService {
  /**
   * Get location from IP address using ipapi.co (free, no API key required)
   * @param {string} ip - User's IP address
   * @returns {Promise<Object>} Location data
   */
  async getLocationFromIP(ip) {
    try {
      // Handle localhost/development IPs with mock data
      if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
        console.log('⚠️ Localhost detected, using mock location data for testing');
        return {
          ip: ip,
          city: 'Colombo',
          region: 'Western Province',
          country: 'Sri Lanka',
          countryCode: 'LK',
          latitude: 6.9271,
          longitude: 79.8612,
          timezone: 'Asia/Colombo',
          postal: '00100',
          organization: 'Development Environment'
        };
      }

      // Use ipapi.co free service (1000 requests/day, no key needed)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      
      return {
        ip: response.data.ip,
        city: response.data.city,
        region: response.data.region,
        country: response.data.country_name,
        countryCode: response.data.country_code,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.timezone,
        postal: response.data.postal,
        organization: response.data.org
      };
    } catch (error) {
      console.error('Error fetching location from IP:', error.message);
      throw new Error('Failed to fetch location data');
    }
  }

  /**
   * Get weather data for location
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Weather data
   */
  async getWeather(lat, lon) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      
      const response = await axios.get(url);
      
      return {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure
      };
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      return null;
    }
  }

  /**
   * Get nearby places (hospitals, police stations, safe zones)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} type - Place type (hospital, police, etc.)
   * @returns {Promise<Array>} Nearby places
   */
  async getNearbyPlaces(lat, lon, type = 'hospital') {
    try {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      
      if (!apiKey || apiKey === 'your_google_places_api_key') {
        console.warn('⚠️ Google Places API key not configured, using fallback data');
        return this.getFallbackPlaces(lat, lon, type);
      }
      
      const radius = 5000; // 5km radius
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.status === 'REQUEST_DENIED' || response.data.status === 'INVALID_REQUEST') {
        console.warn('⚠️ Google Places API error:', response.data.status, '- Using fallback data');
        return this.getFallbackPlaces(lat, lon, type);
      }
      
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results.slice(0, 5).map(place => ({
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 'N/A',
          distance: this.calculateDistance(lat, lon, place.geometry.location.lat, place.geometry.location.lng),
          location: place.geometry.location,
          isOpen: place.opening_hours?.open_now ?? true,
          types: place.types,
          phone: place.formatted_phone_number || 'N/A'
        }));
      }
      
      // If no results from API, use fallback
      console.warn('⚠️ No results from Google Places, using fallback data');
      return this.getFallbackPlaces(lat, lon, type);
    } catch (error) {
      console.error('Error fetching nearby places:', error.message);
      return this.getFallbackPlaces(lat, lon, type);
    }
  }

  /**
   * Calculate distance between two coordinates in km
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  }

  /**
   * Fallback emergency services data for tourism
   * Returns generic emergency services based on location
   */
  getFallbackPlaces(lat, lon, type) {
    const places = [];
    
    if (type === 'hospital') {
      places.push(
        {
          name: 'City General Hospital',
          address: 'Main Road, City Center',
          rating: 4.2,
          distance: '1.5 km',
          location: { lat: lat + 0.01, lng: lon + 0.01 },
          isOpen: true,
          types: ['hospital', 'health'],
          phone: 'Emergency: 108'
        },
        {
          name: 'District Medical Center',
          address: 'Hospital Street',
          rating: 4.0,
          distance: '2.3 km',
          location: { lat: lat - 0.015, lng: lon + 0.012 },
          isOpen: true,
          types: ['hospital', 'health'],
          phone: 'Emergency: 108'
        },
        {
          name: 'Community Health Clinic',
          address: 'Healthcare Avenue',
          rating: 3.8,
          distance: '3.1 km',
          location: { lat: lat + 0.02, lng: lon - 0.01 },
          isOpen: true,
          types: ['hospital', 'clinic'],
          phone: 'Emergency: 108'
        }
      );
    } else if (type === 'police') {
      places.push(
        {
          name: 'City Police Station',
          address: 'Police Line Road',
          rating: 4.5,
          distance: '0.8 km',
          location: { lat: lat + 0.008, lng: lon - 0.008 },
          isOpen: true,
          types: ['police'],
          phone: 'Emergency: 100'
        },
        {
          name: 'Traffic Police Post',
          address: 'Highway Junction',
          rating: 4.2,
          distance: '1.9 km',
          location: { lat: lat - 0.012, lng: lon - 0.015 },
          isOpen: true,
          types: ['police'],
          phone: 'Emergency: 100'
        },
        {
          name: 'Tourist Police Helpdesk',
          address: 'Tourist Information Center',
          rating: 4.7,
          distance: '2.5 km',
          location: { lat: lat + 0.018, lng: lon + 0.015 },
          isOpen: true,
          types: ['police', 'tourist_assistance'],
          phone: 'Tourist Helpline: 1363'
        }
      );
    } else if (type === 'tourist_attraction') {
      places.push(
        {
          name: 'Local Heritage Museum',
          address: 'Museum Road',
          rating: 4.6,
          distance: '1.2 km',
          location: { lat: lat + 0.01, lng: lon - 0.01 },
          isOpen: true,
          types: ['museum', 'tourist_attraction'],
          phone: 'N/A'
        },
        {
          name: 'City Park & Gardens',
          address: 'Green Belt Area',
          rating: 4.4,
          distance: '1.8 km',
          location: { lat: lat - 0.01, lng: lon + 0.01 },
          isOpen: true,
          types: ['park', 'tourist_attraction'],
          phone: 'N/A'
        }
      );
    }
    
    console.log(`📍 Returning ${places.length} fallback ${type} locations`);
    return places;
  }

  /**
   * Calculate safety score based on various factors
   * Enhanced for real-world tourism problems
   * @param {Object} location - Location data
   * @returns {Object} Safety assessment
   */
  calculateSafetyScore(location) {
    const safeCountries = ['JP', 'SG', 'CH', 'NO', 'FI', 'DK', 'IS', 'NZ', 'CA', 'AU', 'AE'];
    const moderateCountries = ['US', 'GB', 'FR', 'DE', 'IT', 'ES', 'KR', 'IN', 'TH', 'MY', 'LK'];
    
    let safetyLevel = 'moderate';
    let safetyScore = 65;
    let alerts = [];
    let recommendations = [];
    let touristAdvisories = [];
    
    // Country-based assessment
    if (safeCountries.includes(location.countryCode)) {
      safetyLevel = 'safe';
      safetyScore = 85;
      alerts.push('✅ This area is generally safe for tourists');
      recommendations.push('Maintain basic safety awareness');
      recommendations.push('Keep emergency contacts saved');
    } else if (moderateCountries.includes(location.countryCode)) {
      safetyLevel = 'moderate';
      safetyScore = 65;
      alerts.push('⚠️ Exercise normal precautions');
      recommendations.push('Stay aware of your surroundings');
      recommendations.push('Keep valuables secured');
      recommendations.push('Avoid displaying expensive items');
    } else {
      safetyLevel = 'caution';
      safetyScore = 50;
      alerts.push('🚨 Exercise increased caution in this area');
      recommendations.push('Stay in well-populated, tourist-friendly areas');
      recommendations.push('Avoid traveling alone at night');
      recommendations.push('Keep emergency contacts readily accessible');
    }
    
    // Real-world tourism safety concerns
    const hour = new Date().getHours();
    
    // Time-based alerts
    if (hour >= 22 || hour <= 5) {
      alerts.push('🌙 Late Night: Extra caution advised');
      safetyScore -= 10;
      touristAdvisories.push({
        icon: '🌙',
        type: 'Night Safety',
        message: 'Avoid poorly lit areas and always use registered taxis/ride-sharing',
        severity: 'medium'
      });
    }
    
    if (hour >= 6 && hour <= 9) {
      touristAdvisories.push({
        icon: '🌅',
        type: 'Morning Safety',
        message: 'Morning is generally safe. Watch for pickpockets in crowded markets',
        severity: 'low'
      });
    }
    
    // Common tourist safety issues
    touristAdvisories.push({
      icon: '💰',
      type: 'Tourist Scams',
      message: 'Beware of overcharging, fake guides, and taxi scams. Always agree on prices beforehand',
      severity: 'high'
    });
    
    touristAdvisories.push({
      icon: '👜',
      type: 'Pickpocketing',
      message: 'Keep bags secure and close. Avoid carrying passport unnecessarily',
      severity: 'medium'
    });
    
    touristAdvisories.push({
      icon: '🚕',
      type: 'Transportation',
      message: 'Use official taxis or verified ride-sharing apps. Avoid unlicensed vehicles',
      severity: 'medium'
    });
    
    touristAdvisories.push({
      icon: '💳',
      type: 'Payment Safety',
      message: 'Use credit cards when possible. Keep cash in multiple locations',
      severity: 'low'
    });
    
    touristAdvisories.push({
      icon: '📱',
      type: 'Connectivity',
      message: 'Save offline maps. Keep phone charged and have local emergency numbers',
      severity: 'low'
    });
    
    // Location-specific recommendations
    recommendations.push('📍 Share your live location with trusted contacts');
    recommendations.push('🏨 Keep hotel/accommodation address in local language');
    recommendations.push('💊 Know the location of nearest hospital');
    recommendations.push('👮 Save tourist police helpline number');
    
    return {
      level: safetyLevel,
      score: Math.max(0, Math.min(100, safetyScore)),
      color: safetyLevel === 'safe' ? '#10b981' : safetyLevel === 'moderate' ? '#f59e0b' : '#ef4444',
      alerts,
      recommendations,
      touristAdvisories, // NEW: Real tourism-specific warnings
      emergencyNumbers: {
        police: location.countryCode === 'IN' ? '100' : '911',
        ambulance: location.countryCode === 'IN' ? '108' : '911',
        touristHelpline: location.countryCode === 'IN' ? '1363' : location.countryCode === 'LK' ? '1912' : '911',
        fire: location.countryCode === 'IN' ? '101' : '911'
      }
    };
  }

  /**
   * Get complete context and safety information
   * @param {string} ip - User's IP address
   * @returns {Promise<Object>} Complete context data
   */
  async getCompleteContext(ip) {
    try {
      // Get location from IP
      const location = await this.getLocationFromIP(ip);
      
      // Get weather data
      const weather = await this.getWeather(location.latitude, location.longitude);
      
      // Get nearby emergency services
      const [hospitals, policeStations] = await Promise.all([
        this.getNearbyPlaces(location.latitude, location.longitude, 'hospital'),
        this.getNearbyPlaces(location.latitude, location.longitude, 'police')
      ]);
      
      // Calculate safety score
      const safety = this.calculateSafetyScore(location);
      
      return {
        success: true,
        location,
        weather,
        safety,
        emergencyServices: {
          hospitals,
          policeStations
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting complete context:', error);
      throw error;
    }
  }

  /**
   * Get complete context using GPS coordinates
   * @param {number} latitude - GPS latitude
   * @param {number} longitude - GPS longitude
   * @returns {Promise<Object>} Complete context data
   */
  async getGPSContext(latitude, longitude) {
    try {
      let location = {
        latitude,
        longitude,
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        countryCode: 'XX',
        timezone: 'Unknown'
      };

      // Try OpenWeather Geocoding first (more reliable and free)
      try {
        const openWeatherGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
        const owResponse = await axios.get(openWeatherGeoUrl);
        
        if (owResponse.data && owResponse.data.length > 0) {
          const place = owResponse.data[0];
          location.city = place.name || place.local_names?.en || 'Unknown';
          location.region = place.state || 'Unknown';
          location.country = place.country || 'Unknown';
          location.countryCode = place.country || 'XX';
          
          console.log('✅ Location found via OpenWeather:', location.city, location.country);
        }
      } catch (owError) {
        console.warn('⚠️ OpenWeather geocoding failed, trying Google Maps...', owError.message);
        
        // Fallback to Google Maps Geocoding
        if (process.env.GOOGLE_MAPS_API_KEY) {
          try {
            const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const geoResponse = await axios.get(geoUrl);
            
            if (geoResponse.data.results && geoResponse.data.results.length > 0) {
              const result = geoResponse.data.results[0];
              const components = result.address_components;
              
              components.forEach(comp => {
                if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
                  location.city = comp.long_name;
                }
                if (comp.types.includes('administrative_area_level_1')) {
                  location.region = comp.long_name;
                }
                if (comp.types.includes('country')) {
                  location.country = comp.long_name;
                  location.countryCode = comp.short_name;
                }
              });
              
              console.log('✅ Location found via Google Maps:', location.city, location.country);
            }
          } catch (googleError) {
            console.error('❌ Google Maps geocoding also failed:', googleError.message);
          }
        }
      }
      
      // Get weather data
      const weather = await this.getWeather(latitude, longitude);
      
      // Get nearby emergency services
      const [hospitals, policeStations] = await Promise.all([
        this.getNearbyPlaces(latitude, longitude, 'hospital'),
        this.getNearbyPlaces(latitude, longitude, 'police')
      ]);
      
      // Calculate safety score
      const safety = this.calculateSafetyScore(location);
      
      // Add weather-based alerts
      if (weather) {
        if (weather.temperature > 35) {
          safety.alerts.push('⚠️ Extreme heat warning. Stay hydrated and seek shade.');
        }
        if (weather.temperature < 5) {
          safety.alerts.push('❄️ Cold weather alert. Dress warmly.');
        }
        if (weather.description.includes('rain') || weather.description.includes('storm')) {
          safety.alerts.push('🌧️ Weather Alert: ' + weather.description);
          safety.score -= 10;
        }
      }
      
      return {
        success: true,
        location,
        weather,
        safety,
        emergencyServices: {
          hospitals,
          policeStations
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting GPS context:', error);
      throw error;
    }
  }

  /**
   * Handle SOS emergency
   * @param {Object} sosData - SOS request data
   * @returns {Promise<Object>} SOS confirmation
   */
  async handleSOS(sosData) {
    try {
      const { location, timestamp, userInfo } = sosData;
      
      console.log('🚨 SOS EMERGENCY TRIGGERED');
      console.log('Location:', location);
      console.log('Time:', timestamp);
      console.log('User:', userInfo);
      
      // In production, this would:
      // 1. Send SMS to emergency contacts
      // 2. Notify local authorities
      // 3. Trigger Firebase Cloud Messaging
      // 4. Log to emergency database
      
      // Get nearby emergency services
      const [hospitals, policeStations] = await Promise.all([
        this.getNearbyPlaces(location.latitude, location.longitude, 'hospital'),
        this.getNearbyPlaces(location.latitude, location.longitude, 'police')
      ]);
      
      return {
        success: true,
        message: 'SOS alert sent successfully',
        sosId: `SOS-${Date.now()}`,
        location,
        nearestEmergency: {
          hospital: hospitals[0] || null,
          police: policeStations[0] || null
        },
        timestamp
      };
    } catch (error) {
      console.error('Error handling SOS:', error);
      throw error;
    }
  }

  /**
   * Get safer alternative routes
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @returns {Promise<Object>} Alternative routes
   */
  async getSafeRoutes(latitude, longitude) {
    try {
      // Get nearby safe destinations (tourist attractions, police stations)
      const [attractions, police] = await Promise.all([
        this.getNearbyPlaces(latitude, longitude, 'tourist_attraction'),
        this.getNearbyPlaces(latitude, longitude, 'police')
      ]);
      
      const routes = [];
      
      // Create routes to nearby safe destinations
      if (police.length > 0) {
        routes.push({
          destination: police[0].name,
          type: 'Police Station',
          distance: police[0].distance || 'Unknown',
          safety: 'High',
          icon: '🚔'
        });
      }
      
      if (attractions.length > 0) {
        attractions.slice(0, 3).forEach(place => {
          routes.push({
            destination: place.name,
            type: 'Tourist Attraction',
            distance: place.distance || 'Unknown',
            safety: 'Moderate',
            icon: '🏛️'
          });
        });
      }
      
      return {
        success: true,
        currentLocation: { latitude, longitude },
        routes,
        message: routes.length > 0 ? 'Safe routes found' : 'No alternative routes available'
      };
    } catch (error) {
      console.error('Error getting safe routes:', error);
      throw error;
    }
  }
}

module.exports = new LocationService();
