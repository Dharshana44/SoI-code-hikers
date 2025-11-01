import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default icon paths for leaflet (works with Vite)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

function LocateControl() {
  const map = useMap()
  return (
    <div className="leaflet-top leaflet-right" style={{ padding: 6 }}>
      <button
        className="btn"
        onClick={() => {
          map.locate({ setView: true, maxZoom: 12 })
        }}
      >
        Locate me
      </button>
    </div>
  )
}

export default function MapPanel() {
  const [markers, setMarkers] = useState([
    { id: 1, lat: 32.219, lng: 76.323, name: 'Green Farm' },
    { id: 2, lat: 32.250, lng: 76.325, name: 'Village Guide HQ' },
    { id: 3, lat: 32.230, lng: 76.310, name: 'Local Cafe' }
  ])

  const mapRef = useRef()

  useEffect(() => {
    // In future, fetch local vendors via API and call setMarkers
  }, [])

  return (
    <div className="map-panel" style={{ minHeight: 220 }}>
      <MapContainer center={[32.22, 76.32]} zoom={11} style={{ height: 260, width: '100%' }} ref={mapRef}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="CartoDB Positron">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.name}</strong>
              <div>
                <small>Eco rating: {Math.round(Math.random() * 20 + 80)}/100</small>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocateControl />
      </MapContainer>

      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button className="btn" onClick={() => alert('Filter: show homestays')}>Homestays</button>
        <button className="btn" onClick={() => alert('Filter: show guides')}>Guides</button>
        <button className="btn" onClick={() => alert('Filter: show cafes')}>Cafes</button>
      </div>
    </div>
  )
}
