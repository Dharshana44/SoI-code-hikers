# Real-Time Context & Safety Feature

A comprehensive MERN stack feature that provides users with real-time location-based safety information, weather updates, and nearby emergency services.

## 🎯 Features

### Backend (Node.js + Express)
- **IP-based Geolocation**: Automatically detects user location using IP address
- **Weather Data**: Real-time weather information using OpenWeather API
- **Emergency Services**: Nearby hospitals and police stations using Google Places API
- **Safety Scoring**: Intelligent safety assessment based on location and time
- **Modular Architecture**: Separate controllers, services, and routes

### Frontend (React)
- **Real-time Dashboard**: Live location and safety information
- **Weather Widget**: Current weather conditions with detailed metrics
- **Emergency Services Finder**: List of nearby hospitals and police stations
- **Safety Score**: Visual safety rating with alerts and recommendations
- **Responsive Design**: Works seamlessly on all devices

## 📁 Project Structure

```
backend/
├── controllers/
│   └── locationController.js    # Request handlers
├── services/
│   └── locationService.js       # Business logic & API calls
├── routes/
│   └── locationRoutes.js        # Route definitions
├── .env                         # Environment variables
└── server.js                    # Main server file

frontend/
├── src/
│   ├── pages/
│   │   └── SafetyContext.jsx    # Main safety feature page
│   ├── components/
│   │   └── Sidebar.jsx          # Updated with new nav link
│   └── styles.css               # Styles for safety feature
```

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install axios
```

### 2. Configure Environment Variables

Update `backend/.env`:

```env
# API Keys (Already Added)
OPENWEATHER_API_KEY=cafe306b31b1dca51ec5fa1536ec844a
GOOGLE_MAPS_API_KEY=AIzaSyBq45tJh3xLqqkhjyTGBBCqDKWtB9PBCas
GOOGLE_PLACES_API_KEY=AIzaSyAQSNszNp38qiOcmv53z2dhRBT12fbo_7M
GOOGLE_GEOCODING_API_KEY=AIzaSyDX6O1--8NesqfDnecZ2Pprqiv9whmwiKw
```

### 3. Start the Backend

```bash
cd backend
npm run dev
```

Backend will be running at: http://localhost:4000

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend will be running at: http://localhost:5173 (or 5175)

## 🧪 Testing the Feature

### Test Endpoints (Backend)

#### 1. Get Location from IP
```bash
curl http://localhost:4000/api/location
```

#### 2. Get Complete Context (Location + Weather + Safety)
```bash
curl http://localhost:4000/api/location/context
```

#### 3. Get Weather for Specific Coordinates
```bash
curl -X POST http://localhost:4000/api/location/weather \
  -H "Content-Type: application/json" \
  -d '{"lat": 37.7749, "lon": -122.4194}'
```

#### 4. Get Nearby Emergency Services
```bash
curl -X POST http://localhost:4000/api/location/nearby \
  -H "Content-Type: application/json" \
  -d '{"lat": 37.7749, "lon": -122.4194, "type": "hospital"}'
```

### Test Frontend

1. Navigate to http://localhost:5173 (or your frontend URL)
2. Login to your account
3. Click on **"Real-Time Context & Safety"** in the left sidebar (🛡️)
4. You should see:
   - Your current location (city, country, coordinates)
   - Safety score with alerts and recommendations
   - Current weather information
   - Nearby hospitals and police stations
   - Emergency contact numbers

## 📊 Example Output

### Location Data:
```json
{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "country": "United States",
  "latitude": 37.386,
  "longitude": -122.0838,
  "timezone": "America/Los_Angeles"
}
```

### Weather Data:
```json
{
  "temperature": 18.5,
  "feelsLike": 17.2,
  "humidity": 65,
  "description": "clear sky",
  "windSpeed": 3.5
}
```

### Safety Assessment:
```json
{
  "level": "safe",
  "score": 85,
  "color": "#10b981",
  "alerts": ["This is generally a safe area."],
  "recommendations": ["Enjoy your visit, but always stay aware of your surroundings."]
}
```

## 🔑 API Keys Used

1. **OpenWeather API** - Free tier (60 calls/minute)
2. **Google Places API** - Requires billing account
3. **Google Geocoding API** - Requires billing account
4. **ipapi.co** - Free (1000 requests/day, no key required)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Axios
- **Frontend**: React, Axios
- **APIs**: OpenWeather, Google Places, Google Geocoding, ipapi.co

## 🎨 Features Overview

### Safety Score Calculation
- Country-based safety rating
- Time-based alerts (nighttime warnings)
- Real-time safety recommendations

### Emergency Services
- Hospitals within 5km radius
- Police stations within 5km radius
- Ratings and opening hours
- Contact information

### Weather Integration
- Current temperature
- Feels-like temperature
- Humidity levels
- Wind speed
- Weather conditions

## 📱 Responsive Design

The feature is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Security Notes

- API keys should be kept in `.env` file
- Never commit `.env` to version control
- Use `.env.example` for reference
- Implement rate limiting in production
- Add authentication for production use

## 🚨 Important Notes

1. **Google APIs require billing**: The Google Places and Geocoding APIs need an active billing account
2. **Testing with localhost**: When testing locally, the IP will be `::1` or `127.0.0.1`, which defaults to a test IP
3. **Production deployment**: Update CORS settings and allowed origins
4. **Rate limits**: Be aware of API rate limits, especially for free tiers

## 🎯 Future Enhancements

- [ ] Real crime data integration
- [ ] User location sharing
- [ ] Emergency alert system
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Custom emergency contacts
- [ ] Route safety checker
- [ ] Community safety reports

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**Built with ❤️ for safer travel experiences**
