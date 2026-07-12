const pool = require('../config/db');

exports.createDriver = async (req, res) => {
    try {
        const { full_name, license_number, license_category, license_expiry, contact_number, safety_score, status } = req.body;
        
        const query = `
            INSERT INTO Drivers 
            (full_name, license_number, license_category, license_expiry, contact_number, safety_score, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            full_name,
            license_number,
            license_category || null,
            license_expiry,
            contact_number || null,
            safety_score || 100.00,
            status || 'Available'
        ]);

        res.status(201).json({ message: 'Driver created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDrivers = async (req, res) => {
    try {
        const [drivers] = await pool.execute('SELECT * FROM Drivers ORDER BY id DESC');
        res.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        await pool.execute('DELETE FROM Drivers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAvailableDrivers = async (req, res) => {
    try {
        const [drivers] = await pool.execute("SELECT * FROM Drivers WHERE status = 'Available' AND license_expiry > CURDATE() ORDER BY id DESC");
        res.json(drivers);
    } catch (error) {
        console.error('Error fetching available drivers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateDriver = async (req, res) => {
    const { full_name, license_number, license_category, license_expiry, contact_number, safety_score, status } = req.body;
    try {
        const [drivers] = await pool.execute('SELECT id FROM Drivers WHERE id = ?', [req.params.id]);
        if (drivers.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        if (license_number) {
            const [existing] = await pool.execute('SELECT id FROM Drivers WHERE license_number = ? AND id != ?', [license_number, req.params.id]);
            if (existing.length > 0) {
                return res.status(400).json({ message: 'Another driver with this license number already exists' });
            }
        }

        const query = `
            UPDATE Drivers SET 
                full_name = COALESCE(?, full_name),
                license_number = COALESCE(?, license_number),
                license_category = COALESCE(?, license_category),
                license_expiry = COALESCE(?, license_expiry),
                contact_number = COALESCE(?, contact_number),
                safety_score = COALESCE(?, safety_score),
                status = COALESCE(?, status)
            WHERE id = ?
        `;

        await pool.execute(query, [
            full_name || null,
            license_number || null,
            license_category || null,
            license_expiry || null,
            contact_number || null,
            safety_score || null,
            status || null,
            req.params.id
        ]);

        res.json({ message: 'Driver updated successfully' });
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
