# 🛡️ Enhanced Real-Time Context & Safety Feature

## Overview
This feature enables the web application to provide **real-time safety alerts and context-aware recommendations** to tourists based on their current location and environment. By integrating live GPS data, weather updates, and area safety information, the system ensures users receive timely notifications about potential risks and suggests safer or alternative travel routes and attractions.

## 🌟 Key Features

### 1. **Live GPS Tracking** 📡
- Real-time location tracking using browser Geolocation API
- High-accuracy positioning with continuous updates
- Automatic fallback to IP-based location if GPS unavailable
- Live accuracy indicator showing GPS precision (±meters)

### 2. **SOS Emergency System** 🚨
- One-click SOS button for emergencies
- 5-second countdown before activation (allows cancellation)
- Automatic location sharing via:
  - Web Share API (mobile devices)
  - Clipboard copy (desktop)
  - Backend notification system
- Displays nearest hospital and police station
- Generates unique SOS ID for tracking

### 3. **Real-Time Notifications** 🔔
- Live notification panel with auto-dismiss
- Color-coded alerts:
  - 🔵 **Info**: General updates
  - 🟢 **Success**: Confirmations
  - 🟡 **Warning**: Caution advisories
  - 🔴 **Danger**: Critical alerts
- Weather-based alerts (extreme heat, cold, rain, storms)
- Safety zone notifications
- Slide-in animation for new notifications

### 4. **Weather Monitoring** 🌦️
- Real-time weather data from OpenWeather API
- Temperature, humidity, wind speed
- Weather condition descriptions with icons
- Automatic weather alerts:
  - Extreme heat warning (>35°C)
  - Cold weather alert (<5°C)
  - Rain/storm notifications

### 5. **Safety Scoring System** 🎯
- Dynamic safety score (0-100)
- Three safety levels:
  - ✅ **SAFE** (80-100): Green zone
  - ⚠️ **MODERATE** (50-79): Yellow zone
  - 🚨 **CAUTION** (<50): Red zone
- Real-time safety recommendations
- Contextual alerts based on:
  - Time of day
  - Weather conditions
  - Location safety metrics

### 6. **Smart Route Planning** 🗺️
- "Find Safer Routes" feature
- Alternative destination suggestions:
  - Nearby police stations (highest safety)
  - Tourist attractions (moderate safety)
- Distance and safety ratings for each route
- One-click "View on Maps" integration

### 7. **Emergency Services Locator** 🏥
- Real-time nearby services using Google Places API:
  - Hospitals & Medical Centers
  - Police Stations
  - Fire Stations
- Distance calculation and ratings
- Direct Google Maps navigation links

### 8. **Auto-Refresh System** 🔄
- Automatic context updates every 5 minutes
- Manual refresh button
- Live data synchronization
- Background GPS tracking

## 🔧 Technologies Used

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client for API requests
- **Geolocation API** - Browser GPS tracking
- **Web Share API** - Emergency location sharing
- **CSS3** - Animations and glassmorphism effects

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP requests to external APIs

### External APIs
- **Google Maps API** - Location tracking & reverse geocoding
- **Google Places API** - Nearby services search
- **Google Geocoding API** - Address resolution
- **OpenWeather API** - Real-time weather data
- **ipapi.co** - IP-based geolocation fallback

### Future Integration
- **Firebase Cloud Messaging (FCM)** - Push notifications
- **WebSocket** - Real-time bidirectional communication
- **MongoDB** - SOS emergency logging

## 📁 File Structure

```
backend/
├── controllers/
│   └── locationController.js      # Request handlers
├── services/
│   └── locationService.js         # Business logic
├── routes/
│   └── locationRoutes.js          # API routes
├── .env                           # API keys
└── server.js                      # Express server

frontend/
├── src/
│   ├── pages/
│   │   └── SafetyContext.jsx      # Main safety component
│   ├── styles.css                 # Component styles
│   └── App.jsx                    # Route configuration
```

## 🚀 API Endpoints

### 1. Get IP-Based Context
```http
GET /api/location/context
```
Returns location, weather, and safety data based on IP address.

### 2. Get GPS-Based Context (NEW)
```http
POST /api/location/gps-context
Content-Type: application/json

{
  "latitude": 6.9271,
  "longitude": 79.8612
}
```
Returns enhanced context data using GPS coordinates with reverse geocoding.

### 3. SOS Emergency (NEW)
```http
POST /api/location/sos
Content-Type: application/json

{
  "location": {
    "latitude": 6.9271,
    "longitude": 79.8612
  },
  "timestamp": "2025-11-04T10:30:00Z",
  "userInfo": {
    "city": "Colombo",
    "country": "Sri Lanka"
  }
}
```
Handles emergency SOS requests with location sharing.

### 4. Get Safe Routes (NEW)
```http
POST /api/location/safe-routes
Content-Type: application/json

{
  "latitude": 6.9271,
  "longitude": 79.8612
}
```
Returns safer alternative destinations and routes.

### 5. Get Weather Data
```http
POST /api/location/weather
Content-Type: application/json

{
  "lat": 6.9271,
  "lon": 79.8612
}
```

### 6. Get Nearby Services
```http
POST /api/location/nearby
Content-Type: application/json

{
  "lat": 6.9271,
  "lon": 79.8612,
  "type": "hospital"
}
```

## 🔐 Environment Variables

Add these to `backend/.env`:

```env
# Google APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Weather API
OPENWEATHER_API_KEY=your_openweather_api_key

# Server
PORT=4000
```

## 💡 Usage Guide

### For Users

1. **Enable GPS**: Click "Allow" when prompted for location access
2. **View Safety Status**: Check the color-coded safety score
3. **Emergency**: Click the red "SOS EMERGENCY" button
4. **Find Safe Routes**: Use "Find Safer Routes" button
5. **View on Maps**: Click coordinates or map button
6. **Monitor Weather**: Check weather widget for conditions

### For Developers

#### Start the Backend Server
```bash
cd backend
npm install
node server.js
```

#### Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Test GPS Functionality
The app will request GPS permission on load. For testing without GPS:
- Disable location services
- App automatically falls back to IP-based location
- Mock data provided for localhost testing

## 🎨 UI Components

### Notifications Panel
- Fixed position (top-right)
- Auto-dismiss after 10 seconds
- Manual close button
- Slide-in animation

### SOS Button
- Prominent red design
- Pulse animation when active
- 5-second countdown
- Cancel option

### GPS Status Badge
- Green when GPS active
- Gray when IP-based
- Shows accuracy (±meters)
- Pulse animation for live tracking

### Safety Score Card
- Progress bar visualization
- Color-coded borders
- Dynamic icon (✅/⚠️/🚨)
- Contextual alerts

## 🔒 Security Features

1. **Location Privacy**: GPS data never stored permanently
2. **HTTPS Only**: Geolocation API requires secure context
3. **User Consent**: Explicit GPS permission required
4. **SOS Countdown**: 5-second delay prevents accidental activation
5. **API Key Security**: Environment variables for sensitive data

## 📱 Mobile Responsiveness

- Touch-optimized buttons
- Responsive grid layouts
- Web Share API for mobile sharing
- Adaptive font sizes
- Mobile-first design

## 🧪 Testing

### Test Scenarios

1. **GPS Available**:
   - Grant location permission
   - Verify live tracking indicator
   - Check coordinate updates

2. **GPS Unavailable**:
   - Deny location permission
   - Verify IP fallback
   - Check notification appears

3. **SOS Test**:
   - Click SOS button
   - Verify 5-second countdown
   - Test cancellation
   - Test location sharing

4. **Weather Alerts**:
   - Check extreme temperature alerts
   - Verify rain/storm notifications
   - Test auto-refresh

5. **Safe Routes**:
   - Click "Find Safer Routes"
   - Verify route suggestions
   - Check distance calculations

## 🚀 Future Enhancements

1. **Firebase Cloud Messaging**: Real-time push notifications
2. **WebSocket Integration**: Live location sharing with contacts
3. **Offline Mode**: Cached safety data for no-connectivity scenarios
4. **Multi-language Support**: Internationalization (i18n)
5. **Voice Alerts**: Audio warnings for critical situations
6. **Geofencing**: Auto-alerts when entering unsafe zones
7. **Emergency Contacts**: Store and notify personal contacts
8. **Travel History**: Track visited locations and safety scores
9. **Community Reports**: User-generated safety updates
10. **Insurance Integration**: Auto-notify travel insurance during SOS

## 📊 Safety Score Algorithm

```javascript
Base Score: 75

Adjustments:
+ Weather good: +5
- Extreme heat/cold: -10
- Rain/storms: -10
- Night time (10pm-5am): -5
- No safety data: -25 (defaults to 50)

Final Score: Clamped between 0-100

Levels:
- 80-100: SAFE ✅
- 50-79: MODERATE ⚠️
- 0-49: CAUTION 🚨
```

## 🤝 Contributing

This feature is part of the Smart Tourism Dashboard project for enhancing traveler safety and trust through real-time contextual awareness.

## 📞 Support

For issues or questions about the Real-Time Context & Safety feature:
1. Check console logs for debugging
2. Verify API keys are configured
3. Ensure HTTPS for GPS features
4. Test with different browsers

---

**Built with ❤️ for Smart Tourism & Traveler Safety**
