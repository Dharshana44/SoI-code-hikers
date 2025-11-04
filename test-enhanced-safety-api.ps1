# Test Enhanced Safety Feature APIs
Write-Host "`n🧪 Testing Enhanced Safety Feature APIs..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Base URL
$baseUrl = "http://localhost:4000/api/location"

# Test 1: IP-Based Context (Original)
Write-Host "`n1️⃣  Testing IP-Based Context..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/context" -Method GET
    Write-Host "✅ IP-Based Context: " -NoNewline -ForegroundColor Green
    Write-Host "SUCCESS (Status: $($response.StatusCode))" -ForegroundColor White
} catch {
    Write-Host "❌ IP-Based Context: " -NoNewline -ForegroundColor Red
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor White
}

# Test 2: GPS-Based Context (NEW)
Write-Host "`n2️⃣  Testing GPS-Based Context..." -ForegroundColor Yellow
try {
    $body = @{
        latitude = 6.9271
        longitude = 79.8612
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/gps-context" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ GPS-Based Context: " -NoNewline -ForegroundColor Green
    Write-Host "SUCCESS (Status: $($response.StatusCode))" -ForegroundColor White
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   📍 Location: $($data.location.city), $($data.location.country)" -ForegroundColor Cyan
    Write-Host "   🌡️  Weather: $($data.weather.temperature)°C, $($data.weather.description)" -ForegroundColor Cyan
    Write-Host "   🛡️  Safety: $($data.safety.level.ToUpper()) (Score: $($data.safety.score))" -ForegroundColor Cyan
} catch {
    Write-Host "❌ GPS-Based Context: " -NoNewline -ForegroundColor Red
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor White
}

# Test 3: SOS Emergency (NEW)
Write-Host "`n3️⃣  Testing SOS Emergency System..." -ForegroundColor Yellow
try {
    $sosBody = @{
        location = @{
            latitude = 6.9271
            longitude = 79.8612
        }
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        userInfo = @{
            city = "Colombo"
            country = "Sri Lanka"
        }
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/sos" -Method POST -Body $sosBody -ContentType "application/json"
    Write-Host "✅ SOS Emergency: " -NoNewline -ForegroundColor Green
    Write-Host "SUCCESS (Status: $($response.StatusCode))" -ForegroundColor White
    
    $sosData = $response.Content | ConvertFrom-Json
    Write-Host "   🚨 SOS ID: $($sosData.sosId)" -ForegroundColor Red
    Write-Host "   🏥 Nearest Hospital: $($sosData.nearestEmergency.hospital.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ SOS Emergency: " -NoNewline -ForegroundColor Red
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor White
}

# Test 4: Safe Routes (NEW)
Write-Host "`n4️⃣  Testing Safe Routes Finder..." -ForegroundColor Yellow
try {
    $routeBody = @{
        latitude = 6.9271
        longitude = 79.8612
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/safe-routes" -Method POST -Body $routeBody -ContentType "application/json"
    Write-Host "✅ Safe Routes: " -NoNewline -ForegroundColor Green
    Write-Host "SUCCESS (Status: $($response.StatusCode))" -ForegroundColor White
    
    $routeData = $response.Content | ConvertFrom-Json
    Write-Host "   🗺️  Found $($routeData.routes.Count) alternative routes" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Safe Routes: " -NoNewline -ForegroundColor Red
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor White
}

# Test 5: Weather Data
Write-Host "`n5️⃣  Testing Weather API..." -ForegroundColor Yellow
try {
    $weatherBody = @{
        lat = 6.9271
        lon = 79.8612
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/weather" -Method POST -Body $weatherBody -ContentType "application/json"
    Write-Host "✅ Weather Data: " -NoNewline -ForegroundColor Green
    Write-Host "SUCCESS (Status: $($response.StatusCode))" -ForegroundColor White
} catch {
    Write-Host "❌ Weather Data: " -NoNewline -ForegroundColor Red
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor White
}

# Test 6: Nearby Services
Write-Host "`n6️⃣  Testing Nearby Services..." -ForegroundColor Yellow
try {
    $nearbyBody = @{
        lat = 6.9271
        lon = 79.8612
        type = "hospital"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/nearby" -Method POST -Body $nearbyBody -ContentType "application/json"
    Write-Host "✅ Nearby Services: " -NoNewline -ForegroundColor Green
    Write-Host "SUCCESS (Status: $($response.StatusCode))" -ForegroundColor White
} catch {
    Write-Host "❌ Nearby Services: " -NoNewline -ForegroundColor Red
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor White
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "✅ All API tests completed!" -ForegroundColor Green
Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:5173/safety in your browser" -ForegroundColor White
Write-Host "   2. Allow GPS location access when prompted" -ForegroundColor White
Write-Host "   3. Test the SOS button (it has a 5-second countdown)" -ForegroundColor White
Write-Host "   4. Try 'Find Safer Routes' feature" -ForegroundColor White
Write-Host "`n"
