const pool = require('../config/db');

exports.createTrip = async (req, res) => {
    try {
        const { trip_number, vehicle_id, driver_id, source, destination, cargo_weight, planned_distance, actual_distance, start_odometer, end_odometer, fuel_used, revenue, trip_status, dispatch_date, completion_date } = req.body;
        
        // 1. Validate Vehicle
        const [vehicles] = await pool.execute('SELECT status, max_load_capacity FROM Vehicles WHERE id = ?', [vehicle_id]);
        if (vehicles.length === 0) return res.status(404).json({ message: 'Vehicle not found' });
        if (vehicles[0].status !== 'Available') return res.status(400).json({ message: 'Selected vehicle is not available' });
        
        // 2. Validate Driver
        const [drivers] = await pool.execute('SELECT status, license_expiry FROM Drivers WHERE id = ?', [driver_id]);
        if (drivers.length === 0) return res.status(404).json({ message: 'Driver not found' });
        if (drivers[0].status !== 'Available') return res.status(400).json({ message: 'Selected driver is not available' });
        if (new Date(drivers[0].license_expiry) <= new Date()) return res.status(400).json({ message: 'Selected driver has an expired license' });
        
        // 3. Validate Cargo Weight
        if (Number(cargo_weight) > Number(vehicles[0].max_load_capacity)) {
            return res.status(400).json({ message: "Cargo weight exceeds vehicle's maximum load capacity" });
        }
        
        const query = `
            INSERT INTO Trips 
            (trip_number, vehicle_id, driver_id, source, destination, cargo_weight, planned_distance, actual_distance, start_odometer, end_odometer, fuel_used, revenue, trip_status, dispatch_date, completion_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            trip_number, vehicle_id, driver_id, source, destination, cargo_weight, 
            planned_distance || null, actual_distance || null, start_odometer || null, 
            end_odometer || null, fuel_used || null, revenue || null, trip_status || 'Draft', 
            dispatch_date || null, completion_date || null
        ]);

        res.status(201).json({ message: 'Trip created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTrips = async (req, res) => {
    try {
        const [trips] = await pool.execute('SELECT * FROM Trips ORDER BY id DESC');
        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        await pool.execute('DELETE FROM Trips WHERE id = ?', [req.params.id]);
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.dispatchTrip = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [trips] = await connection.execute('SELECT vehicle_id, driver_id FROM Trips WHERE id = ?', [req.params.id]);
        if (trips.length === 0) throw new Error('Trip not found');
        const { vehicle_id, driver_id } = trips[0];

        // Validate Vehicle
        const [vehicles] = await connection.execute('SELECT status FROM Vehicles WHERE id = ?', [vehicle_id]);
        if (vehicles.length === 0 || vehicles[0].status !== 'Available') throw new Error('Selected vehicle is not available');

        // Validate Driver
        const [drivers] = await connection.execute('SELECT status, license_expiry FROM Drivers WHERE id = ?', [driver_id]);
        if (drivers.length === 0 || drivers[0].status !== 'Available' || new Date(drivers[0].license_expiry) <= new Date()) {
            throw new Error('Selected driver is not available or has an expired license');
        }

        await connection.execute("UPDATE Trips SET trip_status = 'Dispatched', dispatch_date = NOW() WHERE id = ?", [req.params.id]);
        await connection.execute("UPDATE Vehicles SET status = 'On Trip' WHERE id = ?", [vehicle_id]);
        await connection.execute("UPDATE Drivers SET status = 'On Trip' WHERE id = ?", [driver_id]);

        await connection.commit();
        res.json({ message: 'Trip dispatched successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error dispatching trip:', error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};

exports.completeTrip = async (req, res) => {
    const { actual_distance, end_odometer, fuel_used, revenue } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [trips] = await connection.execute('SELECT vehicle_id, driver_id FROM Trips WHERE id = ?', [req.params.id]);
        if (trips.length === 0) throw new Error('Trip not found');
        const { vehicle_id, driver_id } = trips[0];

        await connection.execute(
            "UPDATE Trips SET trip_status = 'Completed', completion_date = NOW(), actual_distance = ?, end_odometer = ?, fuel_used = ?, revenue = ? WHERE id = ?", 
            [actual_distance || null, end_odometer || null, fuel_used || null, revenue || null, req.params.id]
        );
        
        await connection.execute("UPDATE Vehicles SET status = 'Available', odometer = ? WHERE id = ?", [end_odometer || null, vehicle_id]);
        await connection.execute("UPDATE Drivers SET status = 'Available' WHERE id = ?", [driver_id]);

        await connection.commit();
        res.json({ message: 'Trip completed successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error completing trip:', error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};

exports.cancelTrip = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [trips] = await connection.execute('SELECT vehicle_id, driver_id, trip_status FROM Trips WHERE id = ?', [req.params.id]);
        if (trips.length === 0) throw new Error('Trip not found');
        
        const { vehicle_id, driver_id, trip_status } = trips[0];
        if (trip_status === 'Completed' || trip_status === 'Cancelled') {
            throw new Error(`Cannot cancel a trip that is already ${trip_status}`);
        }

        await connection.execute("UPDATE Trips SET trip_status = 'Cancelled' WHERE id = ?", [req.params.id]);
        await connection.execute("UPDATE Vehicles SET status = 'Available' WHERE id = ?", [vehicle_id]);
        await connection.execute("UPDATE Drivers SET status = 'Available' WHERE id = ?", [driver_id]);

        await connection.commit();
        res.json({ message: 'Trip cancelled successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error cancelling trip:', error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};
