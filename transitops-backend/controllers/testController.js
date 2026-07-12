const pool = require('../config/db');

const testDatabaseConnection = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.status(200).json({ message: 'Database connected successfully' });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
};

module.exports = {
    testDatabaseConnection
};
