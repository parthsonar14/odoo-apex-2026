const pool = require('../config/db');

// Add a new vehicle
const createVehicle = async (req, res) => {
    const { registration_number, vehicle_name, vehicle_model, vehicle_type, max_load_capacity, odometer, acquisition_cost, region, status } = req.body;

    if (!registration_number || !vehicle_name || !vehicle_type || !max_load_capacity) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const [existing] = await pool.execute('SELECT id FROM Vehicles WHERE registration_number = ?', [registration_number]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Vehicle with this registration number already exists' });
        }

        const query = `
            INSERT INTO Vehicles 
            (registration_number, vehicle_name, vehicle_model, vehicle_type, max_load_capacity, odometer, acquisition_cost, region, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const vehicleStatus = status || 'Available';
        const vehicleOdometer = odometer || 0;
        
        const [result] = await pool.execute(query, [
            registration_number, 
            vehicle_name, 
            vehicle_model || null, 
            vehicle_type, 
            max_load_capacity, 
            vehicleOdometer, 
            acquisition_cost || null, 
            region || null, 
            vehicleStatus
        ]);

        res.status(201).json({ message: 'Vehicle created successfully', vehicleId: result.insertId });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all vehicles
const getVehicles = async (req, res) => {
    try {
        const { status, vehicle_type, region } = req.query;
        let query = 'SELECT * FROM Vehicles WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (vehicle_type) {
            query += ' AND vehicle_type = ?';
            params.push(vehicle_type);
        }
        if (region) {
            query += ' AND region = ?';
            params.push(region);
        }

        const [vehicles] = await pool.execute(query, params);
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single vehicle
const getVehicleById = async (req, res) => {
    try {
        const [vehicles] = await pool.execute('SELECT * FROM Vehicles WHERE id = ?', [req.params.id]);
        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicles[0]);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update vehicle
const updateVehicle = async (req, res) => {
    const { registration_number, vehicle_name, vehicle_model, vehicle_type, max_load_capacity, odometer, acquisition_cost, region, status } = req.body;

    try {
        const [vehicles] = await pool.execute('SELECT id FROM Vehicles WHERE id = ?', [req.params.id]);
        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (registration_number) {
            const [existing] = await pool.execute('SELECT id FROM Vehicles WHERE registration_number = ? AND id != ?', [registration_number, req.params.id]);
            if (existing.length > 0) {
                return res.status(400).json({ message: 'Another vehicle with this registration number already exists' });
            }
        }

        const query = `
            UPDATE Vehicles SET 
                registration_number = COALESCE(?, registration_number),
                vehicle_name = COALESCE(?, vehicle_name),
                vehicle_model = COALESCE(?, vehicle_model),
                vehicle_type = COALESCE(?, vehicle_type),
                max_load_capacity = COALESCE(?, max_load_capacity),
                odometer = COALESCE(?, odometer),
                acquisition_cost = COALESCE(?, acquisition_cost),
                region = COALESCE(?, region),
                status = COALESCE(?, status)
            WHERE id = ?
        `;

        await pool.execute(query, [
            registration_number || null,
            vehicle_name || null,
            vehicle_model || null,
            vehicle_type || null,
            max_load_capacity || null,
            odometer || null,
            acquisition_cost || null,
            region || null,
            status || null,
            req.params.id
        ]);

        res.json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a vehicle
const deleteVehicle = async (req, res) => {
    try {
        const [vehicles] = await pool.execute('SELECT status FROM Vehicles WHERE id = ?', [req.params.id]);
        if (vehicles.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (vehicles[0].status === 'On Trip') {
            return res.status(400).json({ message: 'Cannot delete a vehicle that is currently On Trip' });
        }

        await pool.execute('DELETE FROM Vehicles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get available vehicles
const getAvailableVehicles = async (req, res) => {
    try {
        const [vehicles] = await pool.execute("SELECT * FROM Vehicles WHERE status = 'Available' ORDER BY id DESC");
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching available vehicles:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    getAvailableVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
