require('dotenv').config();
const express = require('express');
const cors = require('cors');

const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
