const pool = require('../config/db');

exports.createMaintenance = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { vehicle_id, maintenance_type, description, maintenance_cost, start_date, end_date, status } = req.body;
        
        const query = `
            INSERT INTO Maintenance_Logs 
            (vehicle_id, maintenance_type, description, maintenance_cost, start_date, end_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const logStatus = status || 'Active';
        const [result] = await connection.execute(query, [
            vehicle_id, maintenance_type || null, description || null, maintenance_cost || null, 
            start_date || null, end_date || null, logStatus
        ]);

        if (logStatus === 'Active') {
            await connection.execute("UPDATE Vehicles SET status = 'In Shop' WHERE id = ?", [vehicle_id]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Maintenance record created', id: result.insertId });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating maintenance log:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

exports.getMaintenance = async (req, res) => {
    try {
        const [logs] = await pool.execute('SELECT * FROM Maintenance_Logs ORDER BY id DESC');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching maintenance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMaintenance = async (req, res) => {
    try {
        await pool.execute('DELETE FROM Maintenance_Logs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Maintenance deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.closeMaintenance = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [logs] = await connection.execute('SELECT vehicle_id FROM Maintenance_Logs WHERE id = ?', [req.params.id]);
        if (logs.length === 0) throw new Error('Maintenance log not found');
        const { vehicle_id } = logs[0];

        await connection.execute("UPDATE Maintenance_Logs SET status = 'Completed', end_date = CURDATE() WHERE id = ?", [req.params.id]);

        const [vehicles] = await connection.execute('SELECT status FROM Vehicles WHERE id = ?', [vehicle_id]);
        if (vehicles.length > 0 && vehicles[0].status !== 'Retired') {
            await connection.execute("UPDATE Vehicles SET status = 'Available' WHERE id = ?", [vehicle_id]);
        }

        await connection.commit();
        res.json({ message: 'Maintenance closed successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error closing maintenance:', error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};

exports.updateMaintenance = async (req, res) => {
    const { maintenance_type, description, maintenance_cost, start_date } = req.body;
    try {
        const [logs] = await pool.execute('SELECT status FROM Maintenance_Logs WHERE id = ?', [req.params.id]);
        if (logs.length === 0) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        if (logs[0].status === 'Completed') {
            return res.status(400).json({ message: 'Completed maintenance records cannot be edited' });
        }

        const query = `
            UPDATE Maintenance_Logs SET 
                maintenance_type = COALESCE(?, maintenance_type),
                description = COALESCE(?, description),
                maintenance_cost = COALESCE(?, maintenance_cost),
                start_date = COALESCE(?, start_date)
            WHERE id = ?
        `;

        await pool.execute(query, [
            maintenance_type || null,
            description || null,
            maintenance_cost || null,
            start_date || null,
            req.params.id
        ]);

        res.json({ message: 'Maintenance updated successfully' });
    } catch (error) {
        console.error('Error updating maintenance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
