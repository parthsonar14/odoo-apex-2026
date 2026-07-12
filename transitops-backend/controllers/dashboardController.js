const pool = require('../config/db');

exports.getDashboardKPIs = async (req, res) => {
    try {
        const [activeVehicles] = await pool.execute("SELECT COUNT(*) as count FROM Vehicles WHERE status = 'On Trip'");
        const [availableVehicles] = await pool.execute("SELECT COUNT(*) as count FROM Vehicles WHERE status = 'Available'");
        const [vehiclesInMaintenance] = await pool.execute("SELECT COUNT(*) as count FROM Vehicles WHERE status = 'In Shop'");
        const [totalVehicles] = await pool.execute("SELECT COUNT(*) as count FROM Vehicles");
        
        const [activeTrips] = await pool.execute("SELECT COUNT(*) as count FROM Trips WHERE trip_status = 'Dispatched'");
        const [pendingTrips] = await pool.execute("SELECT COUNT(*) as count FROM Trips WHERE trip_status = 'Draft'");
        
        const [driversOnDuty] = await pool.execute("SELECT COUNT(*) as count FROM Drivers WHERE status = 'On Trip'");

        const totalVehiclesCount = totalVehicles[0].count;
        const activeVehiclesCount = activeVehicles[0].count;
        const fleetUtilization = totalVehiclesCount > 0 ? ((activeVehiclesCount / totalVehiclesCount) * 100).toFixed(1) : '0.0';

        res.json({
            activeVehicles: activeVehiclesCount,
            availableVehicles: availableVehicles[0].count,
            vehiclesInMaintenance: vehiclesInMaintenance[0].count,
            activeTrips: activeTrips[0].count,
            pendingTrips: pendingTrips[0].count,
            driversOnDuty: driversOnDuty[0].count,
            fleetUtilization: parseFloat(fleetUtilization)
        });
    } catch (error) {
        console.error('Error fetching dashboard KPIs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
