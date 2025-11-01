import React from 'react'

export default function EcoMeter({ value = 42 }) {
	return (
		<div className="eco-meter">
			<div className="label">Eco Impact</div>
			<div className="meter">
				<div className="meter-fill" style={{ width: `${value}%` }} />
			</div>
			<div className="value">{value}%</div>
		</div>
	)
}
