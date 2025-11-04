# Test the Real-Time Context & Safety API

Write-Host "Testing Real-Time Context & Safety Feature..." -ForegroundColor Green
Write-Host ""

# Test 1: Get Location from IP
Write-Host "1. Testing Location Detection..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/location" -Method Get
    Write-Host "✅ Location detected: $($response.data.city), $($response.data.country)" -ForegroundColor Green
    Write-Host "   Coordinates: $($response.data.latitude), $($response.data.longitude)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get location" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 2: Get Complete Context
Write-Host "2. Testing Complete Context (Location + Weather + Safety)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/location/context" -Method Get
    Write-Host "✅ Context loaded successfully!" -ForegroundColor Green
    Write-Host "   Location: $($response.location.city), $($response.location.country)" -ForegroundColor Gray
    Write-Host "   Weather: $([Math]::Round($response.weather.temperature))°C, $($response.weather.description)" -ForegroundColor Gray
    Write-Host "   Safety Score: $($response.safety.score)/100 ($($response.safety.level))" -ForegroundColor Gray
    Write-Host "   Hospitals found: $($response.emergencyServices.hospitals.Count)" -ForegroundColor Gray
    Write-Host "   Police stations found: $($response.emergencyServices.policeStations.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get complete context" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing complete! Open your browser to see the full UI:" -ForegroundColor Yellow
Write-Host "http://localhost:5175/safety" -ForegroundColor Cyan
Write-Host ""
