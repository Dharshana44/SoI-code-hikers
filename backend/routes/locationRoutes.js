const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Get user's location from IP
router.get('/', locationController.getLocation);

// Get complete context (location + weather + safety)
router.get('/context', locationController.getContext);

// Get GPS-based context (real-time location tracking)
router.post('/gps-context', locationController.getGPSContext);

// Handle SOS emergency
router.post('/sos', locationController.handleSOS);

// Get safer alternative routes
router.post('/safe-routes', locationController.getSafeRoutes);

// Get weather for specific coordinates
router.post('/weather', locationController.getWeather);

// Get nearby emergency services
router.post('/nearby', locationController.getNearbyServices);

module.exports = router;
