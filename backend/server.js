const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()

const MONGO_URI = process.env.MONGO_URI || ''
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

app.use(cors())
app.use(express.json())

// Basic health route
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Backend running' }))

// Mock overview API used by frontend Overview page
app.get('/api/overview', (req, res) => {
    // In a real app this would query the database and compute these values
    res.json({
        totalTrips: 1248,
        popularDestinations: 12,
        sustainabilityScore: '78%',
        ecoImpact: 42,
        monthlyTrips: [
            { month: 'Jan', trips: 800 },
            { month: 'Feb', trips: 920 },
            { month: 'Mar', trips: 1100 },
            { month: 'Apr', trips: 980 },
            { month: 'May', trips: 1248 },
            { month: 'Jun', trips: 1320 }
        ]
    })
})

// Example POST endpoint (body parsing enabled above)
app.post('/api/tasks', async (req, res) => {
    // In production you'd validate and persist to DB
    const payload = req.body || {}
    return res.status(201).json({ ok: true, data: payload })
})

// --- Auth endpoints ---
// In-memory user store (replace with DB in production)
const users = []

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check if user exists
        const existingUser = users.find(u => u.email === email)
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            ecoPoints: 0,
            createdAt: new Date()
        }

        users.push(user)

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

        // Return user data (without password)
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                ecoPoints: user.ecoPoints
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        // Find user
        const user = users.find(u => u.email === email)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

        // Return user data
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                ecoPoints: user.ecoPoints
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

// Connect to MongoDB only when a MONGO_URI is provided
if (MONGO_URI && !MONGO_URI.includes('<db_password>')) {
    mongoose
        .connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err.message))
} else {
    console.log('Skipping MongoDB connect: set MONGO_URI in .env with a valid connection string to enable DB')
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})