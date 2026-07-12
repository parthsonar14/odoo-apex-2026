const pool = require('../config/db');

exports.createFuelLog = async (req, res) => {
    try {
        const { vehicle_id, trip_id, liters, cost, fuel_date } = req.body;
        
        const query = `
            INSERT INTO Fuel_Logs (vehicle_id, trip_id, liters, cost, fuel_date) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            vehicle_id, trip_id || null, liters, cost, fuel_date
        ]);

        res.status(201).json({ message: 'Fuel log created', id: result.insertId });
    } catch (error) {
        console.error('Error creating fuel log:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFuelLogs = async (req, res) => {
    try {
        const [logs] = await pool.execute('SELECT * FROM Fuel_Logs ORDER BY id DESC');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching fuel logs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteFuelLog = async (req, res) => {
    try {
        await pool.execute('DELETE FROM Fuel_Logs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Fuel log deleted successfully' });
    } catch (error) {
        console.error('Error deleting fuel log:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateFuelLog = async (req, res) => {
    const { liters, cost, fuel_date, trip_id } = req.body;
    try {
        const [logs] = await pool.execute('SELECT id FROM Fuel_Logs WHERE id = ?', [req.params.id]);
        if (logs.length === 0) {
            return res.status(404).json({ message: 'Fuel log not found' });
        }

        const query = `
            UPDATE Fuel_Logs SET 
                liters = COALESCE(?, liters),
                cost = COALESCE(?, cost),
                fuel_date = COALESCE(?, fuel_date),
                trip_id = COALESCE(?, trip_id)
            WHERE id = ?
        `;

        await pool.execute(query, [
            liters || null,
            cost || null,
            fuel_date || null,
            trip_id || null,
            req.params.id
        ]);

        res.json({ message: 'Fuel log updated successfully' });
    } catch (error) {
        console.error('Error updating fuel log:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
