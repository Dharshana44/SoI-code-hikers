import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Overview from './pages/Overview'
import Itineraries from './pages/Itineraries'
import Hub from './pages/Hub'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/AuthContext'
import './styles.css'

export default function App() {
	const { user, login } = useAuth()

	return (
		<Routes>
			<Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={login} />} />
			<Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={login} />} />
			
			<Route path="/*" element={
				<ProtectedRoute>
					<Layout>
						<Routes>
							<Route path="/" element={<Overview />} />
							<Route path="/itineraries" element={<Itineraries />} />
							<Route path="/hub" element={<Hub />} />
							<Route path="/discover" element={<div>Discover page (coming soon)</div>} />
							<Route path="/eco" element={<div>Eco Score page (coming soon)</div>} />
							<Route path="/local" element={<div>Local Culture page (coming soon)</div>} />
							<Route path="/rewards" element={<div>Rewards page (coming soon)</div>} />
							<Route path="/settings" element={<div>Settings page (coming soon)</div>} />
						</Routes>
					</Layout>
				</ProtectedRoute>
			} />
		</Routes>
	)
}
