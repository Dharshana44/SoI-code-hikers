import React from 'react'

// Pure CSS 3D Background Component - No Three.js dependencies
export default function ThreeBackground() {
  return (
    <div className="three-background">
      {/* Animated Gradient Background */}
      <div className="gradient-bg"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  )
}
