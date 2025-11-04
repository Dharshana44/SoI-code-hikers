const locationService = require('../services/locationService');

class LocationController {
  /**
   * Get user's location based on IP address
   * GET /api/location
   */
  async getLocation(req, res) {
    try {
      // Get IP from request
      // Try multiple sources to get the real IP (handles proxies)
      const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
                 req.headers['x-real-ip'] ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 '8.8.8.8'; // Fallback for localhost testing
      
      console.log(`Fetching location for IP: ${ip}`);
      
      const locationData = await locationService.getLocationFromIP(ip);
      
      res.status(200).json({
        success: true,
        data: locationData
      });
    } catch (error) {
      console.error('Location controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch location data',
        message: error.message
      });
    }
  }

  /**
   * Get complete context including location, weather, and safety info
   * GET /api/location/context
   */
  async getContext(req, res) {
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
                 req.headers['x-real-ip'] ||
                 req.connection.remoteAddress ||
                 '8.8.8.8';
      
      console.log(`Fetching complete context for IP: ${ip}`);
      
      const contextData = await locationService.getCompleteContext(ip);
      
      res.status(200).json(contextData);
    } catch (error) {
      console.error('Context controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch context data',
        message: error.message
      });
    }
  }

  /**
   * Get weather for specific coordinates
   * POST /api/location/weather
   */
  async getWeather(req, res) {
    try {
      const { lat, lon } = req.body;
      
      if (!lat || !lon) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }
      
      const weather = await locationService.getWeather(lat, lon);
      
      res.status(200).json({
        success: true,
        data: weather
      });
    } catch (error) {
      console.error('Weather controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch weather data',
        message: error.message
      });
    }
  }

  /**
   * Get nearby emergency services
   * POST /api/location/nearby
   */
  async getNearbyServices(req, res) {
    try {
      const { lat, lon, type } = req.body;
      
      if (!lat || !lon) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }
      
      const places = await locationService.getNearbyPlaces(lat, lon, type || 'hospital');
      
      res.status(200).json({
        success: true,
        data: places
      });
    } catch (error) {
      console.error('Nearby services controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch nearby services',
        message: error.message
      });
    }
  }

  /**
   * Get context using GPS coordinates
   * POST /api/location/gps-context
   */
  async getGPSContext(req, res) {
    try {
      const { latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }
      
      console.log(`Fetching GPS context for coordinates: ${latitude}, ${longitude}`);
      
      const contextData = await locationService.getGPSContext(latitude, longitude);
      
      res.status(200).json(contextData);
    } catch (error) {
      console.error('GPS context controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch GPS context data',
        message: error.message
      });
    }
  }

  /**
   * Handle SOS emergency request
   * POST /api/location/sos
   */
  async handleSOS(req, res) {
    try {
      const sosData = req.body;
      
      if (!sosData.location || !sosData.location.latitude || !sosData.location.longitude) {
        return res.status(400).json({
          success: false,
          error: 'Location data is required for SOS'
        });
      }
      
      console.log('🚨 SOS REQUEST RECEIVED');
      
      const sosResponse = await locationService.handleSOS(sosData);
      
      res.status(200).json(sosResponse);
    } catch (error) {
      console.error('SOS controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process SOS request',
        message: error.message
      });
    }
  }

  /**
   * Get safer alternative routes
   * POST /api/location/safe-routes
   */
  async getSafeRoutes(req, res) {
    try {
      const { latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }
      
      console.log(`Finding safe routes from: ${latitude}, ${longitude}`);
      
      const routes = await locationService.getSafeRoutes(latitude, longitude);
      
      res.status(200).json(routes);
    } catch (error) {
      console.error('Safe routes controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch safe routes',
        message: error.message
      });
    }
  }
}

module.exports = new LocationController();
